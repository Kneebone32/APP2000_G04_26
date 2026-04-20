import { useState, useEffect } from "react";

//Hook for å hente Enums ut fra DB. Laget av Kay
export const useEnums = (enumNavn) => {
  const [enumData, setEnumData] = useState([]);
  const [loadingEnum, setLoadingEnum] = useState(true);
  const [enumError, setEnumError] = useState(null);

  useEffect(() => {
    if (!enumNavn) return; //null check

    const fetchEnum = async () => {
      setLoadingEnum(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/enums/${enumNavn}`);
        if (!response.ok) console.log(`Fant ikke ${enumNavn}`);

        const result = await response.json();

        setEnumData(result);
        setEnumError(null);
      } catch (err) {
        console.error("Enum err:", err);
        setEnumError(err.message);
      } finally {
        setLoadingEnum(false);
      }
    };

    fetchEnum();
  }, [enumNavn]); //refetch når enumNavn byttes

  return { enumData, loadingEnum, enumError };
};
