module.exports = {

    //
    // GLOBALS
    //
    debug: 'false',
    
    signedIn: 'no',
    userType: '',

    //
    // VERSION SPECIFIC SETTINGS
    // 
    settings: {

        // DC146
        dc146: {
            modelOrDataset: 'dataset', // model,dataset
        },

        // V6
        v6: {}
         
    },

    publicReports: [


        {
            title: "MO KTT", // Checked
            alt: "MO KTT - ADQ\\Items|MO KTT - ADQ\\STAR PU|MO KTT - Percentage\\Items|MO KTT - Items\\STAR PU",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/mo-ktt"
        },

        {
            title: "Out of Hours report", // CANNOT FIND
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/out-hours-report"
        },


        {
            title: "Personally Administered Items", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/personally-administered-items"
        },

        {
            title: "Practice detailed prescribing information (PDPI)", // Checked
            alt: "Practice Detailed Prescribing Information",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/practice-detailed-prescribing-information-pdpi"
        },

        {
            title: "Itemised prescribing payment (IPP) report", // Checked
            alt: "Itemised Prescribing Payments",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/itemised-prescribing-payment-ipp-report"
        },


        {
            title: "Prescribing Analysis Reports", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/prescribing-analysis-reports"
        },

        {
            title: "Prescribing comparators", // Checked
            alt: "Specialist Drugs|Potential Generic Savings",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/prescribing-comparators"
        },


        {
            title: "Prescribing monitoring document (PMD)", // Checked
            alt: "Prescribing Monitoring Document",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/report-information/prescribing-monitoring-document-pmd"
        },





        
        



        
        
	
		
		



        {
            title: "Antimicrobial Stewardship – Urinary Tract Infection", // Checked
            alt: "Antimicrobial Stewardship - UTI",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/antimicrobial-stewardship-urinary-tract-infection-dashboard"
        },
        {
            title: "Children's Standard Liquid Concentration", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/childrens-standard-liquid-concentration-dashboard"
        },
        {
            title: "Diabetes", // Checked
            alt: "Diabetes Prescribing Comparators",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/diabetes-dashboard"
        },
        {
            title: "Electronic Prescription Service (EPS) and electronic Repeat Dispensing (eRD) utilisation", //Checked 
            alt: "EPS and eRD Utilisation",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/electronic-prescription-service-eps-and-electronic-repeat-dispensing-erd-utilisation-dashboard"
        },
        {
            title: "Items which should not be routinely prescribed in primary care", // Checked
            alt: "Items not for Routine Prescribing",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/items-which-should-not-be-routinely-prescribed-primary-care"
        },
        {
            title: "Medicines optimisation - generic prescribing",
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/medicines-optimisation-generic-prescribing"
        },
        {
            title: "Medicines optimisation - polypharmacy",
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/medicines-optimisation-polypharmacy"
        },
        {
            title: "Mental health prescribing comparators", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/mental-health-prescribing-comparators"
        },
        {
            title: "National medicines optimisation opportunities", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/national-medicines-optimisation-opportunities"
        },
        {
            title: "Opioid Prescribing Comparators", // Checked
            alt: "Opioid Prescribing Comparators (Snapshot)|Opioid Prescribing Comparators (Trend)",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/opioid-prescribing-comparators-dashboard"
        },
        {
            title: "Oversupply", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/oversupply-dashboard"
        },
        {
            title: "Over the counter items which should not be routinely prescribed in primary care", // Checked
            alt: "OTC Prescribing",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/over-counter-items-which-should-not-be-routinely-prescribed-primary-care"
        },
        {
            title: "Patient Harms", // Checked
            alt: "Patient Harm",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/patient-harms-dashboard"
        },
        {
            title: "Premium-priced generics", // Checked
            alt: "Premium Priced Generics",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/premium-priced-generics"
        },
        {
            title: "Respiratory - Carbon Impact", // Checked
            alt: "Respiratory - Carbon Impact Dashboard",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/respiratory-carbon-impact-dashboard"
        },
        {
            title: "Respiratory", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/respiratory-dashboard"
        },
        {
            title: "Safer management of controlled drugs", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/safer-management-controlled-drugs"
        },
        {
            title: "SGLT2i opportunities", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/sglt2i-opportunities-dashboard"
        },
        {
            title: "Valproate safety", // Checked
            alt: "Valproate Prescribing in Female Patients Under 55",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/valproate-safety-dashboard"
        },
        {
            title: "Volume and cost", // Checked
            alt: "Volume & Cost",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/volume-and-cost-dashboard"
        },
        {
            title: "Antimicrobial stewardship", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/antimicrobial-stewardship"
        },
        {
            title: "Antimicrobial Stewardship - Children", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/antimicrobial-stewardship-children-dashboard"
        },
        {
            title: "Antimicrobial Stewardship - Pharmacy First", // Checked
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/antimicrobial-stewardship-pharmacy-first-dashboard"
        },
        {
            title: "Antimicrobial Stewardship - RightCare UTI Focus Pack", // Discontinued in March 2025
            alt: "",
            link: "https://www.nhsbsa.nhs.uk/access-our-data-products/epact2/dashboards-and-specifications/antimicrobial-stewardship-rightcare-uti-focus-pack-dashboard"
        }
    ]

}