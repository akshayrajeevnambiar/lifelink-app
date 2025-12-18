  import PageHeader from "../../../components/PageHeader";
  import DonorForm from "../../../components/DonorForm";

  export default function AddDonorPage() {
    return (
      <div>
        <PageHeader
          title="Add Donor"
          description="Enter donor details below."
          actions={null}
        />
        <DonorForm />
      </div>
    );
  }
