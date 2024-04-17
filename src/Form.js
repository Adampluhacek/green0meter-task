import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import axios from "axios";

const generateFields = () => {
  const fields = [];
  for (let i = 0; i < 125; i++) {
    const fieldType = faker.helpers.arrayElement([
      "number",
      "text",
      "dropdown",
      "checkbox",
    ]);
    const fieldLabel = getFieldPlaceholder(fieldType);
    const fieldValue = fieldType === "checkbox" ? faker.datatype.boolean() : "";
    fields.push({
      type: fieldType,
      label: fieldLabel,
      value: fieldValue,
      error: false,
    });
  }
  return fields;
};

const getFieldPlaceholder = (fieldType) => {
  switch (fieldType) {
    case "number":
      return "Enter a number";
    case "text":
      return "Enter text";
    case "dropdown":
      return "Select an option";
    case "checkbox":
      return "Check the box";
    default:
      return "";
  }
};

const sendFormData = async (data) => {
  try {
    const response = await axios.post(
      "https://65e86fa34bb72f0a9c4f544a.mockapi.io/forms",
      data
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error sending form data:", error);
  }
};

const Form = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [fields, setFields] = useState(generateFields());

  const handleNext = () => {
    if (activeStep < 49) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFields(generateFields());
    } else {
      sendFormData(fields);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFieldChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  const isStepInvalid = () => {
    return fields.some((field) => !field.value);
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {Array.from({ length: 50 }, (_, index) => (
          <Step key={index}>
            <StepLabel>{`Step ${index + 1}`}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === 50 ? (
          <div>
            <Typography>All steps completed</Typography>
          </div>
        ) : (
          <div>
            <Typography>{`Step ${activeStep + 1}`}</Typography>
            <form>
              <Grid container spacing={2}>
                {fields.map((field, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <FormControl error={field.error} fullWidth>
                      {field.type !== "checkbox" && (
                        <InputLabel>{field.label}</InputLabel>
                      )}
                      {field.type === "text" || field.type === "number" ? (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                          }
                          placeholder={field.label}
                          required
                        />
                      ) : field.type === "dropdown" ? (
                        <Select
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                          }
                          required
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="Option 1">Option 1</MenuItem>
                          <MenuItem value="Option 2">Option 2</MenuItem>
                          <MenuItem value="Option 3">Option 3</MenuItem>
                        </Select>
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(e) =>
                                handleFieldChange(index, e.target.checked)
                              }
                            />
                          }
                          label={field.label}
                        />
                      )}
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </form>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isStepInvalid()}
              >
                {activeStep === 49 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
