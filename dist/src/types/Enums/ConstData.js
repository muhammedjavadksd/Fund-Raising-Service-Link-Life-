"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRaiseDetails = exports.const_data = void 0;
const UtilEnum_1 = require("./UtilEnum");
var const_data;
(function (const_data) {
    const_data[const_data["OTP_LENGTH"] = 6] = "OTP_LENGTH";
    const_data[const_data["OTP_EXPIRE_TIME"] = Date.now() + 1800000] = "OTP_EXPIRE_TIME";
})(const_data || (exports.const_data = const_data = {}));
;
const FundRaiseDetails = {
    [UtilEnum_1.FundRaiserCategory.Education]: [
        "School Supplies",
        "Scholarships",
        "Tutoring Programs",
        "STEM Initiatives",
        "Adult Education"
    ],
    [UtilEnum_1.FundRaiserCategory.MedicalAndHealth]: [
        "Medical Bills",
        "Cancer Treatment",
        "Surgical Procedures",
        "Mental Health Services",
        "Rehabilitation"
    ],
    [UtilEnum_1.FundRaiserCategory.DisasterRelief]: [
        "Emergency Shelter",
        "Food and Water",
        "Medical Aid",
        "Reconstruction",
        "Community Support"
    ],
    [UtilEnum_1.FundRaiserCategory.NonprofitOrganizations]: [
        "Operational Costs",
        "Program Funding",
        "Volunteer Support",
        "Awareness Campaigns",
        "Infrastructure Development"
    ],
    [UtilEnum_1.FundRaiserCategory.CommunityProjects]: [
        "Neighborhood Improvements",
        "Public Parks",
        "Community Centers",
        "Safety Initiatives",
        "Local Events"
    ],
    [UtilEnum_1.FundRaiserCategory.SportsAndRecreation]: [
        "Youth Sports Teams",
        "Equipment and Gear",
        "Facility Upgrades",
        "Travel Expenses",
        "Coaching and Training"
    ],
    [UtilEnum_1.FundRaiserCategory.ArtsAndCulture]: [
        "Art Supplies",
        "Theater Productions",
        "Music Programs",
        "Cultural Festivals",
        "Exhibitions"
    ],
    [UtilEnum_1.FundRaiserCategory.AnimalWelfare]: [
        "Rescue Operations",
        "Shelter Support",
        "Veterinary Care",
        "Wildlife Conservation",
        "Adoption Programs"
    ],
    [UtilEnum_1.FundRaiserCategory.EnvironmentalCauses]: [
        "Conservation Projects",
        "Clean Energy",
        "Recycling Initiatives",
        "Pollution Control",
        "Wildlife Protection"
    ],
    [UtilEnum_1.FundRaiserCategory.ReligiousInitiatives]: [
        "Church Building Funds",
        "Mission Trips",
        "Community Outreach",
        "Religious Education",
        "Faith-based Charities"
    ],
    [UtilEnum_1.FundRaiserCategory.SocialJustice]: [
        "Advocacy Groups",
        "Legal Defense",
        "Education and Awareness",
        "Community Organizing",
        "Policy Reform"
    ],
    [UtilEnum_1.FundRaiserCategory.ScienceAndResearch]: [
        "Medical Research",
        "Technology Development",
        "Environmental Studies",
        "Scientific Conferences",
        "Academic Publications"
    ],
    [UtilEnum_1.FundRaiserCategory.EntrepreneurshipAndInnovation]: [
        "Startup Funding",
        "Product Development",
        "Business Incubators",
        "Market Research",
        "Mentorship Programs"
    ],
    [UtilEnum_1.FundRaiserCategory.MemorialsAndFunerals]: [
        "Funeral Expenses",
        "Memorial Funds",
        "Tribute Events",
        "Family Support",
        "Legacy Projects"
    ],
    [UtilEnum_1.FundRaiserCategory.PersonalEmergencies]: [
        "Accident Recovery",
        "Natural Disasters",
        "Financial Hardships",
        "Legal Issues",
        "Emergency Travel"
    ],
    [UtilEnum_1.FundRaiserCategory.TravelAndAdventure]: [
        "Study Abroad",
        "Expeditions",
        "Volunteering Trips",
        "Cultural Exchanges",
        "Adventure Challenges"
    ],
    [UtilEnum_1.FundRaiserCategory.EventsAndCelebrations]: [
        "Weddings",
        "Birthdays",
        "Anniversaries",
        "Graduations",
        "Reunions"
    ],
    [UtilEnum_1.FundRaiserCategory.YouthPrograms]: [
        "After-School Programs",
        "Summer Camps",
        "Mentorship",
        "Leadership Training",
        "Youth Sports"
    ],
    [UtilEnum_1.FundRaiserCategory.VeteransAndMilitary]: [
        "Veteran Support",
        "Rehabilitation",
        "Family Assistance",
        "Job Training",
        "Memorial Funds"
    ],
    [UtilEnum_1.FundRaiserCategory.HungerAndPoverty]: [
        "Food Banks",
        "Meal Programs",
        "Housing Assistance",
        "Job Training",
        "Financial Aid"
    ],
    [UtilEnum_1.FundRaiserCategory.HousingAndHomelessness]: [
        "Shelter Support",
        "Affordable Housing",
        "Emergency Shelter",
        "Transitional Housing",
        "Housing Programs"
    ],
    [UtilEnum_1.FundRaiserCategory.HumanRights]: [
        "Advocacy",
        "Legal Assistance",
        "Education and Awareness",
        "Policy Reform",
        "Community Support"
    ],
    [UtilEnum_1.FundRaiserCategory.EducationScholarships]: [
        "Undergraduate Scholarships",
        "Graduate Scholarships",
        "Vocational Training",
        "Merit-Based Scholarships",
        "Need-Based Scholarships"
    ],
    [UtilEnum_1.FundRaiserCategory.SeniorCitizens]: [
        "Healthcare Support",
        "Housing Assistance",
        "Social Programs",
        "Meal Programs",
        "Community Engagement"
    ],
    [UtilEnum_1.FundRaiserCategory.CrisisSupport]: [
        "Mental Health Crisis",
        "Domestic Violence",
        "Suicide Prevention",
        "Disaster Response",
        "Emergency Relief"
    ],
    [UtilEnum_1.FundRaiserCategory.MentalHealth]: [
        "Counseling Services",
        "Support Groups",
        "Awareness Campaigns",
        "Rehabilitation Programs",
        "Research and Education"
    ],
    [UtilEnum_1.FundRaiserCategory.TechnologyAndGadgets]: [
        "Innovative Devices",
        "Tech Startups",
        "Research and Development",
        "Prototype Funding",
        "Educational Technology"
    ],
    [UtilEnum_1.FundRaiserCategory.CreativeProjects]: [
        "Film and Video",
        "Writing and Publishing",
        "Music and Audio",
        "Visual Arts",
        "Performance Arts"
    ],
    [UtilEnum_1.FundRaiserCategory.LegalDefense]: [
        "Criminal Defense",
        "Civil Rights Cases",
        "Environmental Law",
        "Human Rights Cases",
        "Legal Aid"
    ],
    [UtilEnum_1.FundRaiserCategory.InternationalAid]: [
        "Disaster Relief",
        "Development Projects",
        "Health Initiatives",
        "Education Programs",
        "Cultural Exchanges"
    ]
};
exports.FundRaiseDetails = FundRaiseDetails;
