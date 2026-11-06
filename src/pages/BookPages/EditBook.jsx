import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";
import { useState, useEffect, useRef } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";

import data from "../../data/dummy_data.json";

const resizeImage = (file, maxSize = 400, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Invalid image"));
    };
    img.src = url;
  });

const currentYear = new Date().getFullYear();
const yearOptions = [];
for (let y = currentYear; y >= 1800; y--) {
  yearOptions.push(String(y));
}

const EditBookForm = ({ book, bookKey }) => {
  const navigate = useNavigate();
  const [isbn, setIsbn] = useState(book.isbn);
  const [title, setTitle] = useState(book.title);
  const [callNumber, setCallNumber] = useState(book.callNumber.replace("B-", ""));
  const [author, setAuthor] = useState(book.author);
  const [synopsis, setSynopsis] = useState(book.synopsis);
  const [publicationYear, setPublicationYear] = useState(String(book.publicationYear));
  const [publicationPlace, setPublicationPlace] = useState(book.placeOfPublication);
  const [genre, setGenre] = useState(Array.isArray(book.genre) ? book.genre.join(", ") : "");
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [borrowable, setBorrowable] = useState(book.borrowable ? ["yes"] : ["no"]);
  const [activeField, setActiveField] = useState(book.borrowable ? "yes" : "no");


  const handleClick = () => {
    navigate("/books");
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setErrors({ ...errors, borrowable: false });

    if (checked) {
      setActiveField(value);
      setBorrowable([value]);
    } else {
      setActiveField(null);
      setBorrowable([]);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    setCoverFile(file);
  };

  const handleSave = async () => {
  
    const newErrors = {};

    if (!isbn.trim()) {
      newErrors.isbn = true;
    }
    if (callNumber.length !== 4) {
      newErrors.callNumber = true;
    }
    if (!author.trim()) {
      newErrors.author = true;
    }
    if (!title.trim()) {
      newErrors.title = true;
    }
    if (!synopsis.trim()) {
      newErrors.synopsis = true;
    }
    if (!publicationYear) {
      newErrors.publicationYear = true;
    }
    if (!genre.trim()) {
      newErrors.genre = true;
    }
    if (borrowable.length === 0) {
      newErrors.borrowable = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in the highlighted fields.");
      return;
    }

    setErrors({});

    setIsSaving(true);
    try {
      const newCover = coverFile ? await resizeImage(coverFile) : null;

      await update(ref(db, `books/${bookKey}`), {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        callNumber: "B-" + callNumber,
        publicationYear: Number(publicationYear),
        placeOfPublication: publicationPlace.trim(),
        genre: genre.split(",").map((g) => g.trim()).filter(Boolean),
        borrowable: borrowable[0] === "yes",
        synopsis: synopsis.trim(),
        ...(newCover && { hasCover: true }),
        ...(removeCover && !newCover && { hasCover: false }),
      });

      if (newCover) {
        await update(ref(db, "bookCovers"), { [book.id]: newCover });
      } else if (removeCover) {
        await update(ref(db, "bookCovers"), { [book.id]: null });
      }
      
      toast.success("Book updated successfully");
      navigate(`/books/${book.id}`);
    } catch (err) {
    console.error(err);
    toast.error("Failed to update the book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-8 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        EDITING {book.title}
      </p>

      <p className="mb-5 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        Book Information
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-25">
        <div className="grid grid-cols-2 gap-x-4">
          <FormInput
            label="ISBN"
            length="w-full"
            value={isbn}
            onChange={(value) => {
              setIsbn(value);
              setErrors({ ...errors, isbn: false });
            }}
            placeholder=""
            error={errors.isbn}
            numbersOnly={true}
          />
          <FormInput
            label="Call No."
            length="w-full"
            value={callNumber}
            onChange={(value) => {
              setCallNumber(value);
              setErrors({ ...errors, callNumber: false });
            }}
            error={errors.callNumber}
            numbersOnly={true}
            maxLength={4}
            prefix="B-"
            placeholder="1242"
          />
        </div>
        <FormInput
          label="Author"
          length="w-full"
          value={author}
          onChange={(value) => {
            setAuthor(value);
            setErrors({ ...errors, author: false });
          }}
          placeholder=""
          error={errors.author}
        />
        <FormInput
          label="Title"
          length="w-full"
          value={title}
          onChange={(value) => {
            setTitle(value);
            setErrors({ ...errors, title: false });
          }}
          placeholder=""
          error={errors.title}
        />
        <FormInput
          label="Synopsis"
          length="w-full"
          value={synopsis}
          onChange={(value) => {
            setSynopsis(value);
            setErrors({ ...errors, synopsis: false });
          }}
          placeholder=""
          error={errors.synopsis}
        />

        {/* Sub-grid for Publication Year and Genre */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="grid grid-cols-2 gap-x-4">
            <FormSelect
              label="Publication Year"
              value={publicationYear}
              onChange={(value) => {
                setPublicationYear(value);
                setErrors({ ...errors, publicationYear: false });
              }}
              options={yearOptions}
              placeholder="Select year"
              error={errors.publicationYear}
            />
            <FormInput
              label="Place of Publication"
              length="w-full"
              value={publicationPlace}
              onChange={setPublicationPlace}
              placeholder="optional"
            />
          </div>
          <FormInput
            label="Genre"
            length="w-full"
            value={genre}
            onChange={(value) => {
              setGenre(value);
              setErrors({ ...errors, genre: false });
            }}
            placeholder=""
            error={errors.genre}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="grid grid-rows-2 items-center text-sm text-[#545F71] self-end pb-2">
            <p className={`mb-1 text-sm ${errors.borrowable ? "text-red-500" : "text-[#545F71]"}`}>Borrowable</p>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                value="yes"
                checked={
                  Array.isArray(borrowable) &&
                  borrowable.includes("yes") &&
                  activeField === "yes"
                }
                onChange={handleCheckboxChange}
                className={`w-4 h-4 rounded text-blue-600 ${errors.borrowable ? "outline outline-1 outline-red-500" : ""}`}
              />
              Yes
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                value="no"
                checked={
                  Array.isArray(borrowable) &&
                  borrowable.includes("no") &&
                  activeField === "no"
                }
                onChange={handleCheckboxChange}
                className={`w-4 h-4 rounded text-blue-600 ${errors.borrowable ? "outline outline-1 outline-red-500" : ""}`}
              />
              No
            </label>
            </div>
            <div className="relative w-full">
              <p className="mb-1 text-sm text-[#545F71]">Upload Book Cover</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-9 w-full items-center justify-between rounded-sm border border-[#545F71] bg-white px-3 text-xs text-[#53657a]">
                    <span className="truncate">
                      {coverFile ? coverFile.name : removeCover ? "Default cover (applied on save)"
                      : book.hasCover ? "Current image (select to replace)" : "Select image..."}
                    </span>
                    <LuUpload size={16} className="text-gray-400" />
                </button>

                {(coverFile || (book.hasCover && !removeCover)) && (
                <button
                  type="button"
                  onClick={() => {
                    if (coverFile) {
                      setCoverFile(null);
                    } else {
                      setRemoveCover(true);
                    }
                }}
                title={coverFile ? "Remove selected image" : "Use default cover"}
                className="text-lg leading-none text-[#545F71] hover:text-[#A35139]">
                  ×
                </button>
                )}
            </div>
          </div>    
        </div>
      </div>

      <p className="mt-4 mb-8 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        NFC Tag
      </p>
      <div className="grid grid-cols-2 gap-x-25">
        <div className="py-10 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
          <LuNfc className="size-10" />
          <p className="mb-5 mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            {book.tagId}
          </p>
          <SecondaryButton text={"Unlink Tag"} to={"unlink-tag"} />
        </div>
        <div className="grid grid-rows-2">
          <BookStatus value="Linked" icon={GoDotFill} />
          <div className="flex flex-row justify-between">
            <SecondaryButton
              text={"Cancel"}
              to={"cancel-book-edit"}
              id={book.id}
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex h-9 w-65 items-center justify-center rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D]
              text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? "Saving..." : "Save Edits"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const EditBook = () => {
  const { bookId } = useParams();
  const [dbBook, setDbBook] = useState(null);
  const [bookKey, setBookKey] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "books"), (snap) => {
      let found = null;
      let foundKey = null;
      if (snap.exists()) {
        Object.entries(snap.val()).forEach(([key, b]) => {
          if (b && b.id === bookId) {
            found = b;
            foundKey = key;
          }
        });
      }
      setDbBook(found);
      setBookKey(foundKey);
      setLoaded(true);
    });
    return unsubscribe;
  }, [bookId]);

  if (!loaded) return <p className="px-15 pt-10">Loading...</p>;
  if (!dbBook) return <p className="px-15 pt-10">Book not found.</p>;

  return <EditBookForm key={dbBook.id} book={dbBook} bookKey={bookKey} />;
};

export default EditBook;
