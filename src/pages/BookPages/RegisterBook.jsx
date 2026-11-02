import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";
import { useState, useRef } from "react";
import { ref, push, update, get, serverTimestamp } from "firebase/database";
import { db, auth } from "../../lib/firebase";

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

  const fileRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5 MB.");
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setError("");
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview("");
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

    const trimmedTag = tagId.trim();
    const year = Number(publicationYear);

    if (!title.trim() || !author.trim() || !isbn.trim() || !callNumber.trim()) {
      setError("Title, author, ISBN and call number are required.");
      return;
    }
    if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear()) {
      setError("Enter a valid 4-digit publication year.");
      return;
    }
    if (borrowable.length === 0) {
      setError("Please choose whether the book is borrowable.");
      return;
    }
    if (!trimmedTag || /[.$#[\]/]/.test(trimmedTag)) {
      setError("Enter a valid tag ID (no . $ # [ ] /).");
      return;
    }

    setIsSaving(true);
    try {
      const tagSnap = await get(ref(db, `nfcTags/${trimmedTag}`));
      if (tagSnap.exists()) {
        setError("This tag is already linked to another item.");
        return;
      }

      // (a) NEW: shrink the chosen image into a small text string (null if none chosen)
      const coverData = coverFile ? await resizeImage(coverFile) : null;

      const key = push(ref(db, "books")).key;

      await update(ref(db), {
        [`books/${key}`]: {
          title: title.trim(),
          author: author.trim(),
          isbn: isbn.trim(),
          callNumber: callNumber.trim(),
          publicationYear: year,
          placeOfPublication: publicationPlace.trim(),
          genre: genre.split(",").map((g) => g.trim()).filter(Boolean),
          borrowable: borrowable[0] === "yes",
          status: "Available",
          tagId: trimmedTag,
          nfcStatus: "Linked",
          // (b) CHANGED: no more bookCover text input, plus a hasCover flag
          cover: `https://covers.openlibrary.org/b/isbn/${isbn.trim()}-L.jpg?default=false`,
          hasCover: Boolean(coverData),
          synopsis: synopsis.trim(),
          dateAdded: new Date().toISOString().slice(0, 10),
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid ?? null,
        },
        // (c) NEW: save the image under its own path (only if one was chosen)
        ...(coverData && { [`bookCovers/${key}`]: coverData }),
        [`nfcTags/${trimmedTag}`]: {
          type: "book",
          refId: key,
          status: "Linked",
        },
      });

      navigate("/books");
    } catch (err) {
      console.error(err);
      setError("Failed to save the book. Please try again.");
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
            onChange={setIsbn}
            placeholder=""
          />
          <FormInput
            label="Call No."
            length="w-full"
            value={callNumber}
            onChange={setCallNumber}
            placeholder=""
          />
        </div>
        <FormInput
          label="Author"
          length="w-full"
          value={author}
          onChange={setAuthor}
          placeholder=""
        />
        <FormInput
          label="Title"
          length="w-full"
          value={title}
          onChange={setTitle}
          placeholder=""
        />
        <FormInput
          label="Synopsis"
          length="w-full"
          value={synopsis}
          onChange={setSynopsis}
          placeholder=""
        />

        {/* Sub-grid for Publication Year and Genre */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput
              label="Publication Year"
              length="w-full"
              value={publicationYear}
              onChange={setPublicationYear}
              placeholder=""
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
            onChange={setGenre}
            placeholder=""
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="grid grid-rows-2 items-center text-sm text-[#545F71] self-end pb-2">
            <p className="mb-1 text-sm text-[#545F71]">Borrowable</p>
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
                className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
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
                className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
              />
              No
            </label>
          </div>
          <div className="relative w-full">
            <p className="mb-1 text-sm text-[#545F71]">Upload Book Cover</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-9 w-full items-center justify-between rounded-sm border border-[#545F71] bg-white px-3 text-xs text-[#53657a]"
            >
              <span className="truncate">{coverFile ? coverFile.name : "Select image..."}</span>
              <LuUpload size={16} className="text-gray-400" />
            </button>
            {coverPreview && (
              <div className="mt-2 flex items-center gap-3">
                <img src={coverPreview} alt="cover preview" className="h-20 rounded-sm object-cover" />
                <button type="button" onClick={handleRemoveCover} className="text-xs text-red-600 underline">
                  Remove
                </button>
              </div>
            )}
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
          onChange={setTagId}
          placeholder="e.g. tagID-204100"
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
