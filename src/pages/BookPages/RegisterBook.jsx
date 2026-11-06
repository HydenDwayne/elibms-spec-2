import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";
import { useState, useRef } from "react";
import { ref, update, get, runTransaction } from "firebase/database";
import { db, auth } from "../../lib/firebase";
import toast from "react-hot-toast";

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

  const getNextKey = (value) => {
    let next = 0;
    if (value) {
      Object.keys(value).forEach((key) => {
        if (Number(key) >= next) {
          next = Number(key) + 1;
        }
      });
    }
    return next;
  };

  const addOne = (current) => {
    return (current || 31) + 1;
  };

const RegisterBook = () => {
  const navigate = useNavigate();
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [publicationPlace, setPublicationPlace] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState({});

  const fileRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    setCoverFile(file);
  };

  const [borrowable, setBorrowable] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const [tagId, setTagId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleSave = async () => {
    setError("");

    const trimmedTag = "tagID-" + tagId;
    const fullCallNumber = "B-" + callNumber;
    const year = Number(publicationYear);

    const newErrors = {};                                   
      if (!isbn.trim()) {                                     
        newErrors.isbn = true;                                
      }                                                       
      if (!title.trim()) {                                    
        newErrors.title = true;                               
      }     
      if (!author.trim()) {
        newErrors.author = true;
      }
      if (callNumber.length !== 4) {
        newErrors.callNumber = true;
      }
      if (!synopsis.trim()) {
        newErrors.synopsis = true;
      }
      if (!genre.trim()) {
        newErrors.genre = true;
      } 
      if (!publicationYear) {
        newErrors.publicationYear = true;
      }   
      if (borrowable.length === 0) {
        newErrors.borrowable = true;
      }
      if (tagId.length !== 6) {
        newErrors.tagId = true;
      }  
      if (Object.keys(newErrors).length > 0) {                
        setErrors(newErrors);                                 
        toast.error("Please fill in the highlighted fields.");
        return;                                               
      }                                                       
     
    setErrors({});                                          

    setIsSaving(true);
    try {
      const tagsSnap = await get(ref(db, "nfcTags"));
      const tagsValue = tagsSnap.exists() ? tagsSnap.val() : null;

      let tagExists = false;
      if (tagsValue) {
        Object.values(tagsValue).forEach((tag) => {
        if (tag && tag.tagId === trimmedTag) {
          tagExists = true;
        }
        });
      }

      if (tagExists) {
        setErrors({ tagId: true });
        toast.error("This tag is already linked to another item.");
        return;
      }
  
      const coverData = coverFile ? await resizeImage(coverFile) : null;

      const counterResult = await runTransaction(ref(db, "counters/books"), addOne);
      const nextNumber = counterResult.snapshot.val() - 1;

      const newId = "BK-" + String(nextNumber).padStart(4, "0");
      const bookKey = nextNumber - 1;
      const tagKey = getNextKey(tagsValue);

      await update(ref(db), {
        [`books/${bookKey}`]: {
          id: newId,
          title: title.trim(),
          author: author.trim(),
          isbn: isbn.trim(),
          callNumber: fullCallNumber,
          publicationYear: year,
          placeOfPublication: publicationPlace.trim(),
          genre: genre.split(",").map((g) => g.trim()).filter(Boolean),
          borrowable: borrowable[0] === "yes",
          status: "Available",
          tagId: trimmedTag,
          nfcStatus: "Linked",
          cover: `https://covers.openlibrary.org/b/isbn/${isbn.trim()}-L.jpg?default=false`,
          coverFallback: "src/assets/book_default.jpg",
          synopsis: synopsis.trim(),
          dateAdded: new Date().toISOString().slice(0, 10),
          hasCover: Boolean(coverData),
        },
      ...(coverData && { [`bookCovers/${newId}`]: coverData }),
      [`nfcTags/${tagKey}`]: {
        tagId: trimmedTag,
        type: "book",
        refId: newId,
        status: "Linked",
      },
    })

      toast.success("Book registered successfully (" + newId + ")");
      navigate("/books");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save the book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-15 py-10 w-full">
      <button
        className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#1D2937]"
        onClick={handleClick}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
          Back to Dashboard
        </span>
      </button>

      <p className="mb-8 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        REGISTER NEW BOOK
      </p>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
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
            numbersOnly={true}
            error={errors.isbn}
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
              numbersOnly={true}
              maxLength={4}
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
            {/* Checkbox 1 */}
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

            {/* Checkbox 2 */}
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
                <span className="truncate">{coverFile ? coverFile.name : "Select image..."}</span>
                <LuUpload size={16} className="text-gray-400" />
              </button>

              {coverFile && (
                <button
                  type="button"
                  onClick={() => setCoverFile(null)}
                  className="text-lg leading-none text-[#545F71] hover:text-[#A35139]">
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 mb-8 text-lg font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        Link NFC Tag
      </p>
      <div className="mb-6 max-w-sm">
        <FormInput
          label="Tag ID (temporary)"
          value={tagId}
          onChange={(value) => {                   
            setTagId(value);                        
            setErrors({ ...errors, tagId: false }); 
          }}                                       
          error={errors.tagId}
          numbersOnly={true}
          maxLength={6}
          prefix="tagID-"
          placeholder="204100"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-25">
        <div className="py-15 bg-white rounded-sm flex justify-center items-center flex-col border border-[#545F71]">
          <LuNfc className="size-10" />
          <p className="mt-2 font-semibold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
            Place the NFC tag near the receiver
          </p>
        </div>
        <div className="grid grid-rows-2">
          <BookStatus value="Waiting for tag..." icon={GoDot} />
          <div className="flex flex-row justify-between">
            <SecondaryButton text={"Cancel"} to={"cancel-book-register"} />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex h-9 w-65 items-center justify-center rounded-sm bg-gradient-to-r from-[#1D2937] to-[#53759D] 
              text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? "Saving..." : "Save Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBook;
