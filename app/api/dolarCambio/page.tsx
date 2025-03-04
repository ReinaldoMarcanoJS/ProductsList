import { DolarQuery } from "@/types";

export const getDolarApi = async (): Promise<DolarQuery> => {
    return fetch('https://ve.dolarapi.com/v1/dolares/oficial')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    });
};
