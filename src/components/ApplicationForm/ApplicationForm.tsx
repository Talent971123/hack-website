import { Formik, FormikHelpers } from "formik";
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { BasicInformation, QuestionPrompts, SchoolInformation, SocialInformation } from "./ApplicationComponents";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    pronouns: string[];
    otherPronouns: string;
    ethnicity: string;
    otherEthnicity: string;
    ageValid: string;
    educationLevel: string;
    schoolName: string;
    major: string;
    firstHack: string;
    portfolioLink?: string;
    linkedInLink?: string;
    resume?: File;
    stressReliefQuestion: string;
    companySpecializeQuestion: string;
}

const initialValues: Values = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    pronouns: [] as string[],
    otherPronouns: "",
    ethnicity: "",
    otherEthnicity: "",
    ageValid: "",
    educationLevel: "",
    schoolName: "",
    major: "",
    firstHack: "",
    portfolioLink: undefined,
    linkedInLink: undefined,
    resume: undefined,
    stressReliefQuestion: "",
    companySpecializeQuestion: ""
}

const validationSchema = yup.object({
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup.string().required("Please enter your email").matches(EMAIL_REGEX, "Sorry, the email address is not valid."),
    gender: yup.string().required("Please select your gender from the given options"),
    pronouns: yup.array().min(1, "Please select at least one of the following pronouns"),
    otherPronouns: yup.string().when('pronouns', {
        is: (pronouns: Array<string>) => pronouns.includes("Other"),
        then: yup.string().required("Please enter your other pronouns since you put 'Other'."),
        otherwise: yup.string().notRequired()
    }),
    ethnicity: yup.string().required("Please select one of the following options for your ethnicity"),
    otherEthnicity: yup.string().when('ethnicity', {
        is: (ethnicity: string) => ethnicity === 'Other',
        then: yup.string().required("Please enter your ethnicity since you put 'Other'."),
        otherwise: yup.string().notRequired()
    }),
    ageValid: yup.string().required("Please answer the age validity question."),
    educationLevel: yup.string().required("Please choose an education level"),
    schoolName: yup.string().required("Please choose one of the following schools you are currently attending"),
    major: yup.string().required("Please enter your current major"),
    firstHack: yup.string().required("Please let us know if this is your first hackathon."),
    companySpecializeQuestion: yup.string().required("Please answer this prompt.")
});


function ApplicationForm() {

    const handleSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>): void => {
        setSubmitting(false);
        // console.log(values)

        const applicationQuery = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            gender: values.gender,
            pronouns: values.pronouns.includes("Other") ?
                values.pronouns.filter(p => p !== "Other").concat([values.otherPronouns]) :
                values.pronouns,
            ethnicity: values.ethnicity === "Other" ? values.otherEthnicity : values.ethnicity,
            is_18_older: values.ageValid === "yes",
            curr_education: values.educationLevel,
            school_name: values.schoolName,
            major: values.major,
            is_first_hackathon: values.firstHack === "yes",
            portfolio_link: values.portfolioLink,
            linkedin_link: values.linkedInLink,
            stress_relief_question: values.stressReliefQuestion,
            company_specialize_question: values.companySpecializeQuestion
        }

        const applyQuery = {
            resume: values.resume,
            application_data: applicationQuery
        }

        console.log(applyQuery)
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, touched, errors, setFieldValue, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <BasicInformation values={values} errors={errors} touched={touched} />
                    <SchoolInformation errors={errors} touched={touched} />
                    <SocialInformation touched={touched} setFieldValue={setFieldValue} />
                    <QuestionPrompts errors={errors} touched={touched} />
                    <Button variant="primary" type="submit" className='button'>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>

    );
}

export default ApplicationForm;
