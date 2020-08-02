import React, { Fragment } from "react"
import { useTable, useSortBy, useExpanded, usePagination } from "react-table"
import { Table, Row, Col, Button, Input, CustomInput } from 'reactstrap';

const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? <i className="fa fa-sort-amount-desc"></i> : <i className="fa fa-sort-amount-asc"></i>) : ""
}

const TableContainer = ({ columns, data, renderRowSubComponent }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        visibleColumns,
        //props for usePagination hook
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 50 }
    },
        useSortBy,
        useExpanded,
        usePagination)

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value))
    }

    const onChangeInInput = event => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0
        gotoPage(page)
    }

    return (
        <Fragment>
            <Table bordered hover {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    <div {...column.getSortByToggleProps()}>
                                        {column.render('Header')}
                                        {generateSortingIndicator(column)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        // console.log("hi", row);
                        return (
                            <Fragment key={row.getRowProps().key}>
                                <tr>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        );
                                    })}
                                </tr>
                                {row.isExpanded && (
                                    <tr>
                                        <td colSpan={visibleColumns.length}>
                                            {renderRowSubComponent(row)}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                </tbody>
            </Table>

            <Row style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                <Col md={3}>
                    <Button
                        color='primary'
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        color='primary'
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        {'<'}
                    </Button>
                </Col>
                <Col md={2} style={{ marginTop: 7 }}>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </Col>
                <Col md={2}>
                    <Input
                        type='number'
                        min={1}
                        style={{ width: 70 }}
                        max={pageOptions.length}
                        defaultValue={pageIndex + 1}
                        onChange={onChangeInInput}
                    />
                </Col>
                <Col md={2}>
                    <CustomInput
                        type='select'
                        value={pageSize}
                        onChange={onChangeInSelect}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </CustomInput>
                </Col>
                <Col md={3}>
                    <Button color='primary' onClick={nextPage} disabled={!canNextPage}>
                        {'>'}
                    </Button>
                    <Button
                        color='primary'
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </Button>
                </Col>
            </Row>
        </Fragment>
    );
};

export default TableContainer;