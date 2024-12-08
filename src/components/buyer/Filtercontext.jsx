import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [selectedResidence, setSelectedResidence] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleCheckboxChange = (selectedValues, setSelectedValues) => (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setSelectedValues(updatedValues);
  };

  const handleClearFilters = () => {
    setSelectedResidence([]);
    setSelectedPriceRange([]);
    setSelectedCondition([]);
    setSelectedAge([]);
    setSelectedCategory([]);
  };

  return (
    <FilterContext.Provider value={{
      selectedResidence,
      selectedPriceRange,
      selectedCondition,
      selectedAge,
      selectedCategory,
      setSelectedResidence,
      setSelectedPriceRange,
      setSelectedCondition,
      setSelectedAge,
      setSelectedCategory,
      handleCheckboxChange,
      handleClearFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
};
