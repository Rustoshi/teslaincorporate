import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyDetails extends Document {
    companyEmail: string;
    companyAddress: string;
    contactPhone: string;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyDetailsSchema: Schema = new Schema(
    {
        companyEmail: { type: String, required: true, default: "contact@muskspace.com" },
        companyAddress: { type: String, required: true, default: "1 Tesla Road, Austin, TX 78725" },
        contactPhone: { type: String, required: true, default: "+1 (888) 518-3752" }
    },
    { timestamps: true }
);

const CompanyDetails = mongoose.models.CompanyDetails || mongoose.model<ICompanyDetails>('CompanyDetails', CompanyDetailsSchema);

export default CompanyDetails;
