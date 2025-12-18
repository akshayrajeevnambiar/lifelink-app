import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectItem } from "./ui/select";

export default function DonorForm() {
  return (
    <form className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input placeholder="Donor name" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Blood Type</label>
        <Select>
          <SelectItem value="A+">A+</SelectItem>
          <SelectItem value="A-">A-</SelectItem>
          <SelectItem value="B+">B+</SelectItem>
          <SelectItem value="B-">B-</SelectItem>
          <SelectItem value="O+">O+</SelectItem>
          <SelectItem value="O-">O-</SelectItem>
          <SelectItem value="AB+">AB+</SelectItem>
          <SelectItem value="AB-">AB-</SelectItem>
        </Select>
      </div>
      <Button type="submit" className="w-full">Add Donor</Button>
    </form>
  );
}
