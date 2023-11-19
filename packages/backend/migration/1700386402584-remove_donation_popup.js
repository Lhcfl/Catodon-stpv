export class RemoveDonationPopup1700386402584 {
	name = "RemoveDonationPopup1700386402584";

	async up(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "meta" DROP COLUMN "donationLink"`,
		);
	}

	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "meta" ADD "donationLink" character varying(256)`,
		);
	}
}
