import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup.string().email("Must be a valid email address.").required("Must include email address"),
    tos: yup.boolean().oneOf([true], "please agree to terms of use"),
    password: yup.string().required("Must have a password")
});

function Form() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        tos: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        tos: "",
        password: ""
    })

    const [users, setUsers] = useState([]);

    const formSubmit = e => {
        e.preventDefault();
        axios.post('https://reqres.in/api/users', formState)
        .then(res => {
            console.log(res)
            setUsers(res.data)
            setFormState({
                name: "",
                email: "",
                password: "",
                tos: ""
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    const validateChange = e => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.name === "tos" ? e.target.checked : e.target.value)
        .then(valid => {
            setErrors({
                ...errors,
                [e.target.name]: ""
            })
        })
        .catch(err => {
            setErrors({
                ...errors,
                [e.target.name]: err.errors[0]
            })
        })
    }

    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        }
        validateChange(e);
        setFormState(newFormData);
    }

    return (
        <div>
            <form onSubmit={formSubmit}>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={inputChange}
                    />
                </label>
                <label htmlFor="email">
                    Email
                    <input
                        type="text"
                        name="email"
                        value={formState.email}
                        onChange={inputChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formState.password}
                        onChange={inputChange}
                    />
                </label>
                <label htmlFor="tos">
                    <input
                        type="checkbox"
                        name="tos"
                        checked={formState.tos}
                        onChange={inputChange}
                    />
                    Terms & Conditions
                </label>
            </form>
            <button>Submit</button>
        </div>
    )
}

export default Form;