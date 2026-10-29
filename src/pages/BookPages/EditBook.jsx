import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormInput from "../../components/FormInput";
import MainButton from "../../components/MainButton";
import SecondaryButton from "../../components/SecondaryButton";
import BookStatus from "../../components/BookNFCStatus";
import { useState } from "react";
import { LuUpload, LuNfc } from "react-icons/lu";
import { GoDot, GoDotFill } from "react-icons/go";

import data from "../../data/dummy_data.json";

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const book = data.books.find((b) => b.id === bookId);
  const [isbn, setIsbn] = useState(book.isbn);
  const [title, setTitle] = useState(book.title);
  const [callNumber, setCallNumber] = useState(book.callNumber);
  const [author, setAuthor] = useState(book.author);
  const [synopsis, setSynopsis] = useState(book.synopsis);
  const [publicationYear, setPublicationYear] = useState(book.publicationYear);
  const [publicationPlace, setPublicationPlace] = useState(book.placeOfPublication);
  const [genre, setGenre] = useState(book.genre.join(", "));
  const [bookCover, setBookCover] = useState("");

  const [borrowable, setBorrowable] = useState(book.borrowable ? ["yes"] : ["no"]);
  const [activeField, setActiveField] = useState(book.borrowable ? "yes" : "no");


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
          <FormInput
            label="Upload Book Cover"
            length="w-full"
            value={bookCover}
            onChange={setBookCover}
            placeholder="Select image..."
            icon={LuUpload}
          />
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
              id={bookId}
            />
            <MainButton text={"Save Edits"} to={"save-book-edit"} id={bookId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
