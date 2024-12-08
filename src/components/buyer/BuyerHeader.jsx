import React, { useState } from 'react';
import { Form, Card, Badge, Accordion, Button } from 'react-bootstrap';
import { Home, DollarSign, Clock, Activity, Grid, Filter } from 'lucide-react';
import { fetchFilteredProducts } from '../../services/api'; // Ensure API call is imported
import { RESIDENCE_OPTIONS, PRICE_OPTIONS, CONDITION_OPTIONS, AGE_OPTIONS, CATEGORY_OPTIONS } from '../../constants/options'; // Your options data

const BuyerHeader = () => {
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

  const handleFilterSubmit = async () => {
    const filters = {
      ...(selectedResidence.length > 0 && { residence: selectedResidence.join(',') }),
      ...(selectedPriceRange.length > 0 && { priceRange: selectedPriceRange.join(',') }),
      ...(selectedCondition.length > 0 && { condition: selectedCondition.join(',') }),
      ...(selectedAge.length > 0 && { age: selectedAge.join(',') }),
      ...(selectedCategory.length > 0 && { category: selectedCategory.join(',') })
    };
  
    try {
      const filteredProducts = await fetchFilteredProducts(filters);
      console.log('Filtered Products:', filteredProducts);
      // Handle the filtered products (e.g., update state, show in UI)
    } catch (error) {
      console.error('Error fetching filtered products:', error.response?.data || error.message);
      // Handle error (show error message to user)
    }
  };

  const getTotalSelectedFilters = () => {
    return [
      selectedResidence,
      selectedPriceRange,
      selectedCondition,
      selectedAge,
      selectedCategory
    ].reduce((acc, curr) => acc + curr.length, 0);
  };

  const CheckboxGroup = ({ options, selectedValues, onChange }) => (
    <Form className="px-2">
      {options.map(({ label, value }) => (
        <Form.Check
          key={value}
          type="checkbox"
          className="mb-2 custom-checkbox"
          label={
            <span className="d-flex justify-content-between w-100">
              {label}
              {selectedValues.includes(value) && (
                <Badge bg="primary" pill className="ms-2">
                  ✓
                </Badge>
              )}
            </span>
          }
          checked={selectedValues.includes(value)}
          onChange={() => onChange(value)}
        />
      ))}
    </Form>
  );

  return (
    <Card className="shadow-sm border-0" style={{ width: '280px' }}>
      <Card.Header className="bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
          <Filter className="me-2" size={20} />
          <h5 className="mb-0" style={{ fontWeight: 'bold', color: '#007bff' }}>Filters</h5>
        </div>
        {getTotalSelectedFilters() > 0 && (
          <Badge bg="primary" pill>
            {getTotalSelectedFilters()}
          </Badge>
        )}
      </Card.Header>

      <Card.Body className="p-0">
        <Accordion flush>
          {/* Residence Filter */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <Home size={16} className="me-2" /> Residence
            </Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                options={RESIDENCE_OPTIONS}
                selectedValues={selectedResidence}
                onChange={handleCheckboxChange(selectedResidence, setSelectedResidence)}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Price Range Filter */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <DollarSign size={16} className="me-2" /> Price Range
            </Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                options={PRICE_OPTIONS}
                selectedValues={selectedPriceRange}
                onChange={handleCheckboxChange(selectedPriceRange, setSelectedPriceRange)}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Condition Filter */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <Activity size={16} className="me-2" /> Condition
            </Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                options={CONDITION_OPTIONS}
                selectedValues={selectedCondition}
                onChange={handleCheckboxChange(selectedCondition, setSelectedCondition)}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Age Filter */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <Clock size={16} className="me-2" /> Age
            </Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                options={AGE_OPTIONS}
                selectedValues={selectedAge}
                onChange={handleCheckboxChange(selectedAge, setSelectedAge)}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Category Filter */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <Grid size={16} className="me-2" /> Category
            </Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                options={CATEGORY_OPTIONS}
                selectedValues={selectedCategory}
                onChange={handleCheckboxChange(selectedCategory, setSelectedCategory)}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>

      {getTotalSelectedFilters() > 0 && (
        <Card.Footer className="bg-white border-top-0 p-3">
          <Button variant="outline-secondary" size="sm" className="w-100" onClick={handleClearFilters}>
            Clear All Filters ({getTotalSelectedFilters()})
          </Button>
        </Card.Footer>
      )}

      <Card.Footer className="bg-white border-top-0 p-3">
        <Button variant="primary" size="sm" className="w-100 mt-2" onClick={handleFilterSubmit}>
          Apply Filters
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default BuyerHeader;
