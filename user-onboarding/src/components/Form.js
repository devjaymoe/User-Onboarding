import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';
import './form.scss'

const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is a required field"),
    email: yup
      .string()
      .email()
      .required("Must include an email"),
    password: yup
      .string()
      .required('Must include a password'),
    terms: yup
      .boolean()
      .oneOf([true], "please agree to terms of use"),
});

function Form() {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    })
    // state for our errors
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });
    // user state initialized as an empty array
    const [users, setUsers] = useState([])
    // disable state for submit button
    const [buttonDisabled, setButtonDisabled] = useState(true);
    // new state to set our post request too. So we can console.log and see it.
    const [post, setPost] = useState([]);
    /* Each time the form value state is updated, check to see if it is valid per our schema. 
    This will allow us to enable/disable the submit button.*/
    useEffect(() => {
    /* We pass the entire state into the entire schema, no need to use reach here. 
    We want to make sure it is all valid before we allow a user to submit
    isValid comes from Yup directly */
        formSchema.isValid(formValues).then(valid => {
            setButtonDisabled(!valid);
        });
    }, [formValues]);
    // yup validation event handler
    const validateChange = event => {
        // Reach will allow us to "reach" into the schema and test only one part.
        yup
            .reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [event.target.name]: ""
                });
            })
            .catch(error => {
                setErrors({
                    ...errors,
                    [event.target.name]: error.errors[0]
                });
            });
    };
    // input change event handler
    const onInputChange = event => {
        event.persist();
        const newFormData = {
            ...formValues,
            [event.target.name]:
            event.target.type === "checkbox" ? event.target.checked : event.target.value
        };
        validateChange(event);
        setFormValues(newFormData);
    };
    
    const onFormSubmit = event => {
        // stop the form from reloading the page on submit
        event.preventDefault()
        // setting up object to be added to user array
        const newUser = {
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
            terms: formValues.terms
        }
        // adding new user to user array
        setUsers([...users, newUser])
        console.log(users)
        // submit the axios request
        axios
            .post('https://reqres.in/api/users', formValues)
            .then(response =>{
                setPost(response.data)
                console.log(response)
                console.log('success', post)
                // reset form values
                setFormValues({
                    name: '',
                    email: '',
                    password: '',
                    terms: ''
                });
            })
            .catch(error => {
                console.log('error', error);
            });
    }
    return  (
        <div className="formContainer">
        <form onSubmit={onFormSubmit}>
            <div>Create a New Account</div>
            <br/>
            <label htmlFor="name" className="name"> 
                <input
                    onChange={onInputChange}
                    value={formValues.name}
                    name='name'
                    type='text'
                    placeholder='User Name'
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>

            <br />
            <label htmlFor="email" className="email"> 
                <input
                    onChange={onInputChange}
                    value={formValues.email}
                    name='email'
                    type='text'
                    placeholder='Email'
                />
                {errors.email.length > 0 ? (
                    <p className="error"> {errors.email}</p>
                ) : null}
            </label>

            <br />
            <label htmlFor="password" className="password"> 
                <input
                    onChange={onInputChange}
                    value={formValues.password}
                    name='password'
                    type='text'
                    placeholder='Password'
                />
                {errors.password.length > 0 ? (
                    <p className="error"> {errors.password}</p>
                ) : null}
            </label>

            <br />
            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    name="terms"
                    checked={formValues.terms}
                    onChange={onInputChange}
                    className='checkbox'
                />
                Terms and Conditions
            </label>

            <br />
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
            <div>
                <h3>List of Users:</h3>
                {
                users.map((user, index) => (
                    <div key={index} className='users'>
                    {user.name} {user.email} {user.terms}
                    </div>
                ))
                }
            </div>
        </div>
    );
}

export default Form;