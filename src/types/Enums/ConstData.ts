import { FundRaiserCategory } from "./UtilEnum";

enum const_data {
    OTP_LENGTH = 6,
    OTP_EXPIRE_TIME = Date.now() + 1800000,
    FUND_RAISER_PICTURES_LENGTH = 5,
    FUND_RAISER_DOCUMENTS_LENGTH = 5
};



enum S3Folder {
    FundRaiserPicture = "fund-raiser-pictures",
    FundRaiserDocument = "fund-raiser-documents",
    FundRaiserCertificate = "fund-raiser-certificate"
}

const FundRaiseDetails: { [key in FundRaiserCategory]: string[] } = {
    [FundRaiserCategory.Education]: [
        "School Supplies",
        "Scholarships",
        "Tutoring Programs",
        "STEM Initiatives",
        "Adult Education"
    ],
    [FundRaiserCategory.MedicalAndHealth]: [
        "Medical Bills",
        "Cancer Treatment",
        "Surgical Procedures",
        "Mental Health Services",
        "Rehabilitation"
    ],
    [FundRaiserCategory.DisasterRelief]: [
        "Emergency Shelter",
        "Food and Water",
        "Medical Aid",
        "Reconstruction",
        "Community Support"
    ],
    [FundRaiserCategory.NonprofitOrganizations]: [
        "Operational Costs",
        "Program Funding",
        "Volunteer Support",
        "Awareness Campaigns",
        "Infrastructure Development"
    ],
    [FundRaiserCategory.CommunityProjects]: [
        "Neighborhood Improvements",
        "Public Parks",
        "Community Centers",
        "Safety Initiatives",
        "Local Events"
    ],
    [FundRaiserCategory.SportsAndRecreation]: [
        "Youth Sports Teams",
        "Equipment and Gear",
        "Facility Upgrades",
        "Travel Expenses",
        "Coaching and Training"
    ],
    [FundRaiserCategory.ArtsAndCulture]: [
        "Art Supplies",
        "Theater Productions",
        "Music Programs",
        "Cultural Festivals",
        "Exhibitions"
    ],
    [FundRaiserCategory.AnimalWelfare]: [
        "Rescue Operations",
        "Shelter Support",
        "Veterinary Care",
        "Wildlife Conservation",
        "Adoption Programs"
    ],
    [FundRaiserCategory.EnvironmentalCauses]: [
        "Conservation Projects",
        "Clean Energy",
        "Recycling Initiatives",
        "Pollution Control",
        "Wildlife Protection"
    ],
    [FundRaiserCategory.ReligiousInitiatives]: [
        "Church Building Funds",
        "Mission Trips",
        "Community Outreach",
        "Religious Education",
        "Faith-based Charities"
    ],
    [FundRaiserCategory.SocialJustice]: [
        "Advocacy Groups",
        "Legal Defense",
        "Education and Awareness",
        "Community Organizing",
        "Policy Reform"
    ],
    [FundRaiserCategory.ScienceAndResearch]: [
        "Medical Research",
        "Technology Development",
        "Environmental Studies",
        "Scientific Conferences",
        "Academic Publications"
    ],
    [FundRaiserCategory.EntrepreneurshipAndInnovation]: [
        "Startup Funding",
        "Product Development",
        "Business Incubators",
        "Market Research",
        "Mentorship Programs"
    ],
    [FundRaiserCategory.MemorialsAndFunerals]: [
        "Funeral Expenses",
        "Memorial Funds",
        "Tribute Events",
        "Family Support",
        "Legacy Projects"
    ],
    [FundRaiserCategory.PersonalEmergencies]: [
        "Accident Recovery",
        "Natural Disasters",
        "Financial Hardships",
        "Legal Issues",
        "Emergency Travel"
    ],
    [FundRaiserCategory.TravelAndAdventure]: [
        "Study Abroad",
        "Expeditions",
        "Volunteering Trips",
        "Cultural Exchanges",
        "Adventure Challenges"
    ],
    [FundRaiserCategory.EventsAndCelebrations]: [
        "Weddings",
        "Birthdays",
        "Anniversaries",
        "Graduations",
        "Reunions"
    ],
    [FundRaiserCategory.YouthPrograms]: [
        "After-School Programs",
        "Summer Camps",
        "Mentorship",
        "Leadership Training",
        "Youth Sports"
    ],
    [FundRaiserCategory.VeteransAndMilitary]: [
        "Veteran Support",
        "Rehabilitation",
        "Family Assistance",
        "Job Training",
        "Memorial Funds"
    ],
    [FundRaiserCategory.HungerAndPoverty]: [
        "Food Banks",
        "Meal Programs",
        "Housing Assistance",
        "Job Training",
        "Financial Aid"
    ],
    [FundRaiserCategory.HousingAndHomelessness]: [
        "Shelter Support",
        "Affordable Housing",
        "Emergency Shelter",
        "Transitional Housing",
        "Housing Programs"
    ],
    [FundRaiserCategory.HumanRights]: [
        "Advocacy",
        "Legal Assistance",
        "Education and Awareness",
        "Policy Reform",
        "Community Support"
    ],
    [FundRaiserCategory.EducationScholarships]: [
        "Undergraduate Scholarships",
        "Graduate Scholarships",
        "Vocational Training",
        "Merit-Based Scholarships",
        "Need-Based Scholarships"
    ],
    [FundRaiserCategory.SeniorCitizens]: [
        "Healthcare Support",
        "Housing Assistance",
        "Social Programs",
        "Meal Programs",
        "Community Engagement"
    ],
    [FundRaiserCategory.CrisisSupport]: [
        "Mental Health Crisis",
        "Domestic Violence",
        "Suicide Prevention",
        "Disaster Response",
        "Emergency Relief"
    ],
    [FundRaiserCategory.MentalHealth]: [
        "Counseling Services",
        "Support Groups",
        "Awareness Campaigns",
        "Rehabilitation Programs",
        "Research and Education"
    ],
    [FundRaiserCategory.TechnologyAndGadgets]: [
        "Innovative Devices",
        "Tech Startups",
        "Research and Development",
        "Prototype Funding",
        "Educational Technology"
    ],
    [FundRaiserCategory.CreativeProjects]: [
        "Film and Video",
        "Writing and Publishing",
        "Music and Audio",
        "Visual Arts",
        "Performance Arts"
    ],
    [FundRaiserCategory.LegalDefense]: [
        "Criminal Defense",
        "Civil Rights Cases",
        "Environmental Law",
        "Human Rights Cases",
        "Legal Aid"
    ],
    [FundRaiserCategory.InternationalAid]: [
        "Disaster Relief",
        "Development Projects",
        "Health Initiatives",
        "Education Programs",
        "Cultural Exchanges"
    ]
};


export { const_data, FundRaiseDetails, S3Folder }
