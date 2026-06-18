const options = ['oop', 'os', 'dbms', 'cn', 'dsa'];

const SubjectMultiSelect = ({ value = [], onChange }) => {
  const toggle = (subj) => {
    if (value.includes(subj)) {
      onChange(value.filter((x) => x !== subj));
    } else {
      onChange([...value, subj]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((subj) => (
        <button
          key={subj}
          type="button"
          onClick={() => toggle(subj)}
          className={`px-3 py-2 rounded-lg border capitalize ${
            value.includes(subj) ? 'bg-blue-600 text-white' : 'bg-white'
          }`}
        >
          {subj}
        </button>
      ))}
    </div>
  );
};

export default SubjectMultiSelect;