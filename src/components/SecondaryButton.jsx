import { useNavigate } from "react-router-dom";

function SecondaryButton({ text, to , id = null}) {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (to) {
      case "cancel-book-register":
        navigate("/books");
        break;
      case "cancel-patron-register":
        navigate("/patrons");
        break;
      case "edit-book":
        navigate(`/books/${id}/editing`);
        break;
      case "edit-patron":
        navigate(`/patrons/${id}/editing`);
        break;
      case "unlink-tag":
        navigate(`/`);
        break;
      case "cancel-book-edit":
        navigate(`/books/${id}`);
        break;
      case "cancel-patron-edit":
        navigate(`/patrons/${id}`);
        break;
      case "cancel-borrow-book":
        navigate("/borrow/txn");
        break;
      case "cancel-return-book":
        navigate("/return/txn");
        break;
      case "cancel-borrow-book-2":
        navigate("/borrow/");
        break;
      case "cancel-return-book-2":
        navigate("/return/");
        break;
      default:
        navigate("/");
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        flex
        h-9
        w-65
        items-center
        justify-center
        rounded-sm
        border
        border-[#1D2937]
        bg-white
        text-sm
        font-semibold
        text-[#1D2937]
        transition-colors
        duration-200
        hover:bg-[#f7f4f2]"
    >
      {text}
    </button>
  );
}

export default SecondaryButton;
