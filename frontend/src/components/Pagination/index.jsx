import React from 'react';
import './styles.scss';
import {Pagination} from "semantic-ui-react";

const PaginationBlock = ({totalPages, onChange, active}) => {

    return (
        <div className='pagination-block'>
            <Pagination
                onPageChange={onChange}
                activePage={active}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                totalPages={Math.round(totalPages || 0)}
            />
        </div>
    )
};

export default PaginationBlock;