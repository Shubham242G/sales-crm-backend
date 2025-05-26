// components/FixedActionButtons.tsx

type FixedActionButtonsProps = {
  onSave: () => void;
  onCancel: () => void;
  showSave?: boolean;
};

export default function FixedActionButtons({ onSave, onCancel, showSave = true }: FixedActionButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 w-[84.5%] ml-[15.5%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
      {showSave && (
        <button
          onClick={onSave}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-3 rounded"
        >
          Save
        </button>
      )}
      <button
        onClick={onCancel}
        className="border border-gray-300 text-sm text-black font-medium  rounded hover:bg-gray-100 py-1.5 px-3"
      >
        Cancel
      </button>
    </div>
  );
}
