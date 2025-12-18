/*
  Warnings:

  - A unique constraint covering the columns `[name,bloodGroup,location]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Donor_name_bloodGroup_location_key" ON "Donor"("name", "bloodGroup", "location");
