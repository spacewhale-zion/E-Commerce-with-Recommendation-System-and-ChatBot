import { 
    AiOutlineSortAscending, 
    AiOutlineSortDescending 
  } from "react-icons/ai";
  import { 
    Column, 
    usePagination, 
    useSortBy, 
    useTable, 
    TableOptions, 
    TableInstance 
  } from "react-table";
  
  function TableHOC<T extends object>(
    columns: Column<T>[],
    data: T[],
    containerClassname: string,
    heading: string,
    showPagination: boolean = false
  ) {
    return function HOC() {
      const options: TableOptions<T> = {
        columns,
        data,
        initialState: {
          pageSize: 6, // Removed unnecessary pagination object wrapper
        },
      };
  
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state: { pageIndex },
        pageCount, // Added for better pagination control
      } = useTable<T>(options, useSortBy, usePagination) as TableInstance<T>;
  
      return (
        <div className={containerClassname}>
          <h2 className="heading">{heading}</h2>
  
          <table className="table" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th 
                      {...column.getHeaderProps(column.getSortByToggleProps())} 
                      key={column.id}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {column.render("Header")}
                        <span style={{ marginLeft: '5px' }}>
                          {column.isSorted && (
                            column.isSortedDesc ? (
                              <AiOutlineSortDescending />
                            ) : (
                              <AiOutlineSortAscending />
                            )
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
  
          {showPagination && data.length > 0 && (
            <div className="table-pagination">
              <button 
                disabled={!canPreviousPage} 
                onClick={previousPage}
              >
                Prev
              </button>
              <span>
                {`Page ${pageIndex + 1} of ${pageCount}`}
              </span>
              <button 
                disabled={!canNextPage} 
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    };
  }
  
  export default TableHOC;