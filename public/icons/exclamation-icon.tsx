const ExclamationIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
    >
      <circle cx={12} cy={12} r={10} stroke="#FF4500" strokeWidth={2} />
      <line
        x1={12}
        y1={7}
        x2={12}
        y2={13}
        stroke="#FF4500"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={12} cy={17} r={1} fill="#FF4500" />
    </svg>
  );
};
export default ExclamationIcon;
