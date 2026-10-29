function DashboardWidgets({ title, value, icon }) {
  return (
    // Widget Card
    <div
      className="group
        h-25
        w-52
        shrink-0
        rounded-2xl
        border
        border-white
        bg-gradient-to-br
        from-[#eef0f4]
        to-[#ffffff]
        px-5
        py-5
        shadow-[0_3px_3px_rgba(0,0,0,0.12)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:shadow-[0_8px_18px_rgba(0,0,0,0.14)]"
    >
      {/* Icon n Text  */}
      <div className="flex items-start gap-[18px]">
        {/* For Icon */}
        <div
          className="flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-[#AA563F]
                to-[#f5a04f]
                text-white
                transition-transform
                duration-300
                group-hover:scale-105"
        >
          {icon}
        </div>

        {/* For Text */}
        <div className="">
          <p className="whitespace-nowrap text-[12px] font-normal uppercase leading-none text-[#545F71]">
            {title}
          </p>

          <p className="mt-2 text-4xl font-semibold leading-[0.8] tracking-[-2px] text-[#293949]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardWidgets;
