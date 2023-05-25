import React from "react";

import {
    Tr,
    Td,
} from '@chakra-ui/react'

export const Row = ({
    EmpID,
    ProjectID,
    DateFrom,
    DateTo
}) => {
    // console.log((new Date(DateTo) - new Date(DateFrom)) / 3600000 / 60)
    console.log((new Date(DateTo) - new Date(DateFrom)) / 86400000)


    return (
        <Tr>
            <Td isNumeric>{EmpID}</Td>
            <Td isNumeric>{EmpID}</Td>
            <Td isNumeric>{ProjectID}</Td>
            <Td isNumeric>{Number(new Date(DateTo).toLocaleString('en-GB', { day: 'numeric' })) - 
                           Number(new Date(DateFrom).toLocaleString('en-GB', { day: 'numeric' }))}</Td>
        </Tr>
    );
};