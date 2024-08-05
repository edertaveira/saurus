import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function Table({
  isChecked = false,
  columns,
  data,
  keyName,
  onSelect = () => {},
}) {
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const handleSelectAll = (event) => {
    const selected = event.target.checked;
    let selects = [];
    setAllSelected(selected);
    if (selected) {
      selects = data.map((item) => item?.[keyName]);
    }
    setSelected(selects);
    onSelect(selects);
  };

  const handleSelect = (event, keyId) => {
    const valueChecked = event.target.checked;
    setSelected((prevSelected) => {
      if (valueChecked) {
        onSelect([...prevSelected, keyId]);
        return [...prevSelected, keyId];
      } else {
        onSelect(prevSelected.filter((id) => id !== keyId));
        return prevSelected.filter((id) => id !== keyId);
      }
    });
  };

  useEffect(() => {
    setAllSelected(selected.length === data.length && data.length > 0);
  }, [selected, data]);

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="w-full bg-gray-100 border-b">
          {isChecked && (
            <th className="p-2 border-r">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </th>
          )}
          {columns.map((col, index) => {
            const isLast = index === columns.length - 1;
            return (
              <th
                key={col.key}
                className={`p-2  text-left text-xs ${!isLast && "border-r"}`}
              >
                {col.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          return (
            <tr
              key={row?.[keyName] ?? index}
              className="border-b hover:bg-gray-50"
            >
              {isChecked && (
                <td className="p-2 border-r text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row?.[keyName])}
                    onChange={(event) => handleSelect(event, row?.[keyName])}
                  />
                </td>
              )}
              {columns.map((col, index) => {
                const isLast = index === columns.length - 1;
                return (
                  <td
                    key={col.key}
                    className={`p-2  text-left text-xs ${
                      !isLast && "border-r"
                    }`}
                  >
                    {col?.render
                      ? col?.render(row?.[col.key] ?? null, row)
                      : row?.[col.key] ?? ""}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  isChecked: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyName: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};
