

enum FundRaiserFileType {
    Document = "Document",
    Pictures = "Pictures"
}

enum FundRaiserBankAccountType {
    Savings = "saving",
    Current = "current",
}

enum FundRaiserCategory {
    Education = "Education",
    MedicalAndHealth = "Medical and Health",
    DisasterRelief = "Disaster Relief",
    NonprofitOrganizations = "Nonprofit Organizations",
    CommunityProjects = "Community Projects",
    SportsAndRecreation = "Sports and Recreation",
    ArtsAndCulture = "Arts and Culture",
    AnimalWelfare = "Animal Welfare",
    EnvironmentalCauses = "Environmental Causes",
    ReligiousInitiatives = "Religious Initiatives",
    SocialJustice = "Social Justice",
    ScienceAndResearch = "Science and Research",
    EntrepreneurshipAndInnovation = "Entrepreneurship and Innovation",
    MemorialsAndFunerals = "Memorials and Funerals",
    PersonalEmergencies = "Personal Emergencies",
    TravelAndAdventure = "Travel and Adventure",
    EventsAndCelebrations = "Events and Celebrations",
    YouthPrograms = "Youth Programs",
    VeteransAndMilitary = "Veterans and Military",
    HungerAndPoverty = "Hunger and Poverty",
    HousingAndHomelessness = "Housing and Homelessness",
    HumanRights = "Human Rights",
    EducationScholarships = "Education Scholarships",
    SeniorCitizens = "Senior Citizens",
    CrisisSupport = "Crisis Support",
    MentalHealth = "Mental Health",
    TechnologyAndGadgets = "Technology and Gadgets",
    CreativeProjects = "Creative Projects",
    LegalDefense = "Legal Defense",
    InternationalAid = "International Aid"
}

enum StatusCode {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    BAD_REQUESR = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICT = 409,
}






export { FundRaiserBankAccountType, FundRaiserFileType, FundRaiserCategory, StatusCode }