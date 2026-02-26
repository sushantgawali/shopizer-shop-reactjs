import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm, Controller } from "react-hook-form";

// Validation rules aligned with Shopizer API constraints and existing codebase patterns
const addressFormRules = {
  addressLabel: {
    maxLength: { value: 50, message: "Label must be 50 characters or fewer" }
  },
  addressType: {
    required: "Address type is required"
  },
  firstName: {
    required: "First name is required",
    minLength: { value: 2, message: "First name must be at least 2 characters" },
    maxLength: { value: 50, message: "First name must be 50 characters or fewer" },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "First name can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  lastName: {
    required: "Last name is required",
    minLength: { value: 2, message: "Last name must be at least 2 characters" },
    maxLength: { value: 50, message: "Last name must be 50 characters or fewer" },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "Last name can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  company: {
    maxLength: { value: 100, message: "Company name must be 100 characters or fewer" }
  },
  address: {
    required: "Address is required",
    minLength: { value: 5, message: "Please enter a complete street address" },
    maxLength: { value: 255, message: "Address must be 255 characters or fewer" }
  },
  city: {
    required: "City is required",
    minLength: { value: 2, message: "City must be at least 2 characters" },
    maxLength: { value: 100, message: "City must be 100 characters or fewer" },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s'.-]+$/,
      message: "City can only contain letters, spaces, hyphens, and periods"
    }
  },
  country: {
    required: "Country is required"
  },
  stateProvince: {
    required: "State / Province is required",
    minLength: { value: 2, message: "State / Province code must be 2 characters (e.g. MI, ON)" },
    maxLength: { value: 2, message: "State / Province code must be 2 characters (e.g. MI, ON)" },
    pattern: {
      value: /^[a-zA-Z0-9]{2}$/,
      message: "State / Province code must be exactly 2 alphanumeric characters (e.g. MI, ON)"
    }
  },
  postalCode: {
    required: "Postal code is required",
    minLength: { value: 3, message: "Postal code must be at least 3 characters" },
    maxLength: { value: 12, message: "Postal code must be 12 characters or fewer" },
    pattern: {
      value: /^[a-zA-Z0-9\s-]+$/,
      message: "Postal code can only contain letters, numbers, spaces, and hyphens"
    }
  },
  phone: {
    required: "Phone number is required",
    minLength: { value: 7, message: "Phone number must be at least 7 digits" },
    maxLength: { value: 20, message: "Phone number must be 20 characters or fewer" },
    pattern: {
      value: /^[0-9\s\-+()]+$/,
      message: "Phone number can only contain digits, spaces, +, -, (, )"
    }
  }
};

const AddressModal = ({ show, onHide, onSubmit, initialValues, countryData, stateData, onCountryChange }) => {
  const { register, handleSubmit, errors, control, setValue, reset } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if (show) {
      if (initialValues) {
        setValue("addressLabel", initialValues.addressLabel || "");
        setValue("addressType", initialValues.addressType || "SHIPPING");
        setValue("defaultAddress", initialValues.defaultAddress || false);
        setValue("firstName", initialValues.firstName || "");
        setValue("lastName", initialValues.lastName || "");
        setValue("company", initialValues.company || "");
        setValue("address", initialValues.address || "");
        setValue("city", initialValues.city || "");
        setValue("postalCode", initialValues.postalCode || "");
        setValue("phone", initialValues.phone || "");
        if (initialValues.country) {
          onCountryChange(initialValues.country);
          setValue("country", initialValues.country);
          setTimeout(() => {
            setValue("stateProvince", initialValues.zone || initialValues.stateProvince || "");
          }, 500);
        }
      } else {
        reset({
          addressLabel: "",
          addressType: "SHIPPING",
          defaultAddress: false,
          firstName: "",
          lastName: "",
          company: "",
          address: "",
          city: "",
          country: "",
          stateProvince: "",
          postalCode: "",
          phone: ""
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, initialValues]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      zone: data.stateProvince,
      defaultAddress: data.defaultAddress === true || data.defaultAddress === "true"
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialValues && initialValues.id ? "Edit Address" : "Add New Address"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="address-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row">

            {/* Address Label – optional */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Address Label</label>
                <input
                  type="text"
                  name="addressLabel"
                  placeholder="e.g. Home, Work"
                  ref={register(addressFormRules.addressLabel)}
                />
                {errors.addressLabel && <p className="error-msg">{errors.addressLabel.message}</p>}
              </div>
            </div>

            {/* Address Type – required */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Address Type <span style={{ color: "red" }}>*</span></label>
                <Controller
                  name="addressType"
                  control={control}
                  rules={addressFormRules.addressType}
                  defaultValue="SHIPPING"
                  render={props => (
                    <select onChange={(e) => props.onChange(e.target.value)} value={props.value}>
                      <option value="SHIPPING">Shipping</option>
                      <option value="BILLING">Billing</option>
                      <option value="BOTH">Both (Billing &amp; Shipping)</option>
                    </select>
                  )}
                />
                {errors.addressType && <p className="error-msg">{errors.addressType.message}</p>}
              </div>
            </div>

            {/* Default address checkbox */}
            <div className="col-lg-12 col-md-12">
              <div className="billing-info mb-20">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="defaultAddress"
                    ref={register()}
                  />
                  Set as default address
                </label>
              </div>
            </div>

            {/* First Name */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>First Name <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="firstName"
                  ref={register(addressFormRules.firstName)}
                />
                {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
              </div>
            </div>

            {/* Last Name */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Last Name <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="lastName"
                  ref={register(addressFormRules.lastName)}
                />
                {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Company – optional */}
            <div className="col-lg-12">
              <div className="billing-info mb-20">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  ref={register(addressFormRules.company)}
                />
                {errors.company && <p className="error-msg">{errors.company.message}</p>}
              </div>
            </div>

            {/* Street Address */}
            <div className="col-lg-12">
              <div className="billing-info mb-20">
                <label>Street Address <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="address"
                  placeholder="House number and street name"
                  ref={register(addressFormRules.address)}
                />
                {errors.address && <p className="error-msg">{errors.address.message}</p>}
              </div>
            </div>

            {/* Country */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Country <span style={{ color: "red" }}>*</span></label>
                <Controller
                  name="country"
                  control={control}
                  rules={addressFormRules.country}
                  defaultValue=""
                  render={props => (
                    <select
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        onCountryChange(e.target.value);
                      }}
                      value={props.value}
                    >
                      <option value="">Select a country</option>
                      {countryData && countryData.map((data, i) => (
                        <option key={i} value={data.code}>{data.name}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.country && <p className="error-msg">{errors.country.message}</p>}
              </div>
            </div>

            {/* State / Province */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>State / Province <span style={{ color: "red" }}>*</span></label>
                {stateData && stateData.length > 0 ? (
                  <Controller
                    name="stateProvince"
                    control={control}
                    rules={addressFormRules.stateProvince}
                    defaultValue=""
                    render={props => (
                      <select onChange={(e) => props.onChange(e.target.value)} value={props.value}>
                        <option value="">Select a state</option>
                        {stateData.map((data, i) => (
                          <option key={i} value={data.code}>{data.name}</option>
                        ))}
                      </select>
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    name="stateProvince"
                    placeholder="State or province"
                    ref={register(addressFormRules.stateProvince)}
                  />
                )}
                {errors.stateProvince && <p className="error-msg">{errors.stateProvince.message}</p>}
              </div>
            </div>

            {/* City */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Town / City <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="city"
                  ref={register(addressFormRules.city)}
                />
                {errors.city && <p className="error-msg">{errors.city.message}</p>}
              </div>
            </div>

            {/* Postal Code */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Postal Code <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="postalCode"
                  ref={register(addressFormRules.postalCode)}
                />
                {errors.postalCode && <p className="error-msg">{errors.postalCode.message}</p>}
              </div>
            </div>

            {/* Phone */}
            <div className="col-lg-6 col-md-6">
              <div className="billing-info mb-20">
                <label>Phone <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. +1 313-555-0100"
                  ref={register(addressFormRules.phone)}
                />
                {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
              </div>
            </div>

          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" type="button" onClick={onHide}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" form="address-form">
          {initialValues && initialValues.id ? "Save Changes" : "Add Address"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
