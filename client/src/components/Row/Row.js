import React from "react";

import {
    Tr,
    Td,
} from '@chakra-ui/react'

export const Row = ({
    FirstEmpID,
    SecondEmpID,
    ProjectID,
    DaysWorked,
}) => {

    return (
        <Tr>
            <Td isNumeric>{FirstEmpID}</Td>
            <Td isNumeric>{SecondEmpID}</Td>
            <Td isNumeric>{ProjectID}</Td>
            <Td isNumeric>{DaysWorked}</Td>
        </Tr>
    );
};