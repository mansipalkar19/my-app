import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const DataTableComponent = () => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('');

    const fetchData = async (page, pageSize, keyword) => {
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/all_products/search_products_data', {
                page,
                pageSize,
                keyword,
            });

            const responseData = response.data.data;
            setData(responseData.matchedProducts);
            setTotalRows(responseData.totalPages * pageSize); // Assuming totalPages is the total number of pages, not total rows.
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage, 10, keyword); // default pageSize is set to 10
    }, [currentPage, keyword]);

    const columns = [
        {
            name: 'Project Name',
            selector: row => row.project_name,
            sortable: true,
        },
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
    ];

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        await fetchData(page, newPerPage, keyword);
    };

    return (
        <div>
            <SearchBar setKeyword={setKeyword} />
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
            />
        </div>
    );
};

const SearchBar = ({ setKeyword }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        setKeyword(inputValue);
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default DataTableComponent;
