import { useNavigate } from "react-router-dom";

function MainButton({ text, to, id = null }) {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (to) {
      case "register-book":
        navigate("/books/register");
        break;
      case "register-patron":
        navigate("/patrons/register");
        break;
      case "save-book":
        navigate("/");
        break;
      case "register-new-patron":
        navigate("/patrons");
        break;
      case "archive-book":
        navigate("/");
        break;
      case "archive-patron":
        navigate("/patrons");
        break;
      case "save-book-edit":
        navigate(`/books/${id}`);
        break;
      case "save-patron-edit":
        navigate(`/patrons/${id}`);
        break;
      case "borrow-book":
        navigate("/borrow");
        break;
      case "return-book":
        navigate("/return");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex
        h-9
        w-65
        items-center
        justify-center
        gap-1
        rounded-sm
        bg-gradient-to-r
        from-[#1D2937]
        to-[#53759D]
        text-sm
        font-semibold
        text-white
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-md
        active:translate-y-0"
    >
      {text}
    </button>
  );
}

export default MainButton;
