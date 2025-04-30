import { useState } from 'react';
//import Papa from 'papaparse';

interface RegleRecord {
    id: number;
    code: string;
    lp: string;
    ord: string;
  }
function useRegle() {
    const rows = [
        { id: 1,code:'00001',lp:"aaa",ord:"rrrr"
       },
       { id: 1,code:'00002',lp:"bbb",ord:"rrrr"
      },
      { id: 1,code:'00003',lp:"ccc",ord:"rrrr"
       },
      ];
  const [data, setData] = useState(rows);

  const addRecord = (newRecord:any) => {
    // Logic to add a new record to the data array
    setData([...data, newRecord]);
  };

  const updateRecord = (updatedRecord:any) => {
    // Logic to update a record in the data array
    setData(data.map(item => item.id === updatedRecord.id ? updatedRecord : item));
  };

  const deleteRecord = (recordId:number) => {
    console.log(recordId);
    // Logic to delete a record from the data array
    setData(data.filter(item => item.id !== recordId));
  };

  
  return { data, addRecord, updateRecord, deleteRecord};
}
export default useRegle;