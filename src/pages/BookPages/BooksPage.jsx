import SearchField from "../../components/SearchField";
import MainButton from "../../components/MainButton";
import BookTable from "../../components/BookTable";
import { useState } from "react";

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", genre: "Fiction", status: "Returned", borrowable: "Yes" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", genre: "Classic", status: "Borrowed", borrowable: "No" },
  { id: 3, title: "1984", author: "George Orwell", isbn: "9780451524935", genre: "Dystopian", status: "Overdue", borrowable: "Yes" },
  { id: 4, title: "Moby Dick", author: "Herman Melville", isbn: "9781503280786", genre: "Adventure", status: "Archived", borrowable: "No" },
  { id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", genre: "Fiction", status: "Returned", borrowable: "Yes" },
  { id: 6, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", genre: "Classic", status: "Borrowed", borrowable: "No" },
  { id: 7, title: "1984", author: "George Orwell", isbn: "9780451524935", genre: "Dystopian", status: "Overdue", borrowable: "Yes" },
  { id: 8, title: "Moby Dick", author: "Herman Melville", isbn: "9781503280786", genre: "Adventure", status: "Archived", borrowable: "No" },
  { id: 9, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", genre: "Fiction", status: "Returned", borrowable: "Yes" },
  { id: 10, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", genre: "Classic", status: "Borrowed", borrowable: "No" },
  { id: 11, title: "1984", author: "George Orwell", isbn: "9780451524935", genre: "Dystopian", status: "Overdue", borrowable: "Yes" },
  { id: 12, title: "Moby Dick", author: "Herman Melville", isbn: "9781503280786", genre: "Adventure", status: "Archived", borrowable: "No" },
];

  return (
    <div className="px-15 py-10 w-full">
      <p className="mb-20 text-2xl font-bold bg-gradient-to-b from-[#1D2937] to-[#53759D] bg-clip-text text-transparent">
        BOOKS PAGE
      </p>

      <div className="flex justify-between pr-4">
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          filter={selectedFilter}
          onFilterChange={setSelectedFilter}
          placeholder="Search title, author, ISBN, ..."
          isBooks={true}
        />

        <MainButton text={"Register Book"} to={"register-book"}/>
      </div>
      

      <div className="mt-10">
        <BookTable books={books}/>
      </div>
    </div>
  );
};

export default BooksPage;
