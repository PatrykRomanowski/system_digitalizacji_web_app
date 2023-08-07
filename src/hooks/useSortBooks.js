import React from "react";

function useSortBooks() {
    const counter = () => {
        console.log(1);
    }
    return {
        counter,
    }
}

export default useSortBooks;