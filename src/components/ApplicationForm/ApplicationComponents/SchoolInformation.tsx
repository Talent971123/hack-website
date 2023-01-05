import { Row } from "react-bootstrap";
import {
	FormSectionProps,
	SchoolInformationTypes,
} from "../ApplicationInterfaces";
import {
	FieldInputGroup,
	FieldSelectGroup,
	FieldYesNoRadioGroup,
} from "./InputComponents";

const educationLevelList = [
	"First Year Undergraduate",
	"Second Year Undergraduate",
	"Third Year Undergraduate",
	"Fourth Year Undergraduate",
	"Fifth+ Year Undergraduate",
	"Graduate",
];
const schoolList = [
	"UC Irvine",
	"UC San Diego",
	"UCLA",
	"UC Berkeley",
	"Cal State Long Beach",
	"Cal State Fullerton",
	"Cal Poly Pomona",
	"UC Riverside",
	"UC Santa Barbara",
	"Other",
];

function SchoolInformation({
	values,
	errors,
	touched,
}: Pick<
	FormSectionProps<SchoolInformationTypes>,
	"values" | "errors" | "touched"
>) {
	return (
		<div>
			<h3>School Information</h3>
			<Row>
				<FieldSelectGroup
					name="schoolName"
					label="University"
					controlId="formUniversity"
					isTouched={touched.schoolName}
					errorMsg={errors.schoolName}
					optionList={schoolList}
					className={
						values.schoolName.includes("Other")
							? "col-12 col-sm-12 col-lg-6"
							: ""
					}
				/>
				{values.schoolName === "Other" && (
					<FieldInputGroup
						name="otherSchoolName"
						label="If Other was selected, which university did you go to?"
						placeholder="University"
						controlId="formOtherUniversity"
						isTouched={touched.otherSchoolName}
						errorMsg={errors.otherSchoolName}
						className="col-12 col-sm-12 col-lg-6"
					/>
				)}
			</Row>
			<Row>
				<FieldSelectGroup
					name="educationLevel"
					label="Current Education Level"
					controlId="formEducation"
					isTouched={touched.educationLevel}
					errorMsg={errors.educationLevel}
					optionList={educationLevelList}
					className="col-12 col-md-6 col-lg-4"
				/>
				<FieldInputGroup
					name="major"
					label="Major"
					controlId="formMajor"
					isTouched={touched.major}
					errorMsg={errors.major}
					className="col-12 col-md-6 col-lg-4"
				/>
				<FieldYesNoRadioGroup
					name="firstHack"
					label="Is this your first hackathon?"
					controlId="formFirstHack"
					isTouched={touched.firstHack}
					errorMsg={errors.firstHack}
					className="col-12 col-md-12 col-lg-4"
				/>
			</Row>
		</div>
	);
}

export default SchoolInformation;
