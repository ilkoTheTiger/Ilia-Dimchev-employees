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
            <Td>{FirstEmpID}</Td>
            <Td>{SecondEmpID}</Td>
            <Td>{ProjectID}</Td>
            <Td>{DaysWorked}</Td>
        </Tr>
    );
};