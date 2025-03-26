export default function OrderByTitle(props: { orderBy: string; setOrderBy: (orderBy: string) => void }) {
  return (
    <>
      {/* This sets up the ability to order ascending or descending */}
      <label>Order by title:</label>
      <select className="form-select"
        value={props.orderBy}
        onChange={(e) => {
          props.setOrderBy(e.target.value);
        }}
      >
        <option value="Asc">Ascending</option>
        <option value="Desc">Descending</option>
      </select>
    </>
  );
}
