const mongoose = require("mongoose");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const Subject = require("../models/subject.model.js");
const Topic = require("../models/topic.model.js");
const Descriptive = require("../models/descriptive.model.js");
const Mcq = require("../models/mcq.model.js");
const bcrypt = require("bcryptjs");

const collectionExists = async (collectionName) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    return collections.some((col) => col.name === collectionName);
  } catch (error) {
    console.warn(`Warning: Failed to check collection ${collectionName}.`);
    return false;
  }
};

const seedDatabase = async () => {
  try {
    const userCount = (await collectionExists("users"))
      ? await User.countDocuments()
      : 0;
    const roleCount = (await collectionExists("roles"))
      ? await Role.countDocuments()
      : 0;
    const subjectCount = (await collectionExists("subjects"))
      ? await Subject.countDocuments()
      : 0;
    const topicCount = (await collectionExists("topics"))
      ? await Topic.countDocuments()
      : 0;
    const descriptiveCount = (await collectionExists("descriptives"))
      ? await Topic.countDocuments()
      : 0;
    const mcqCount = (await collectionExists("mcqs"))
      ? await Topic.countDocuments()
      : 0;

    if (
      userCount > 0 ||
      roleCount > 0 ||
      subjectCount > 0 ||
      topicCount > 0 ||
      descriptiveCount > 0 ||
      mcqCount > 0
    ) {
      console.log("Database already seeded. Skipping seeding process.");
      return;
    }

    console.log("Seeding database with initial data...");

    const roles = [{ name: "Admin" }, { name: "Teacher" }, { name: "Student" }];
    await Role.insertMany(roles);

    const adminRole = await Role.findOne({ name: "Admin" });
    const teacherRole = await Role.findOne({ name: "Teacher" });
    const studentRole = await Role.findOne({ name: "Student" });

    const users = [
      {
        name: "Saim",
        email: "saim@gmail.com",
        password: await bcrypt.hash("abc@123", 10),
        phone: "0324-9632514",
        role: teacherRole._id,
        code: "EMP0001",
      },
      {
        name: "Saqib",
        email: "saqib@gmail.com",
        password: await bcrypt.hash("lmn@456", 10),
        phone: "0320-1234567",
        role: adminRole._id,
        code: "EMP0002",
      },
      {
        name: "Hamza",
        email: "hamza@gmail.com",
        password: await bcrypt.hash("cde@456", 10),
        phone: "0323-2563147",
        role: studentRole._id,
        code: "STU00001",
      },
      {
        name: "Ali",
        email: "ali@gmail.com",
        password: await bcrypt.hash("fgh@789", 10),
        phone: "0322-1475236",
        role: studentRole._id,
        code: "STU00002",
      },
      {
        name: "Raza",
        email: "raza@gmail.com",
        password: await bcrypt.hash("ijk@123", 10),
        phone: "0321-1236547",
        role: studentRole._id,
        code: "STU00003",
      },
    ];
    await User.insertMany(users);

    const subjects = [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Marketing" },
    ];
    const insertedSubjects = await Subject.insertMany(subjects);

    const subjectMap = {};
    insertedSubjects.forEach((subject) => {
      subjectMap[subject.name] = subject._id;
    });

    const topics = [
      { name: "Thermodynamics", subject: subjectMap["Physics"] },
      { name: "Electromagnetism", subject: subjectMap["Physics"] },

      { name: "Organic Chemistry", subject: subjectMap["Chemistry"] },
      { name: "Chemical Bonding", subject: subjectMap["Chemistry"] },

      { name: "Consumer Behavior", subject: subjectMap["Marketing"] },
      { name: "Brand Management", subject: subjectMap["Marketing"] },
    ];
    const insertedTopics = await Topic.insertMany(topics);

    const topicMap = {};
    insertedTopics.forEach((topic) => {
      topicMap[topic.name] = topic._id;
    });

    const thermodynamicDescriptiveQuestions = [
      {
        text: "What is thermodynamics?",
        answer:
          "Thermodynamics is the branch of physics that studies the relationships between heat, energy, and work.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Define temperature.",
        answer:
          "Temperature is a measure of the average kinetic energy of the particles in a substance.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is heat?",
        answer:
          "Heat is the transfer of thermal energy from one object to another due to a difference in temperature.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What does the Zeroth Law of Thermodynamics state?",
        answer:
          "The Zeroth Law of Thermodynamics states that if two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is an isolated system?",
        answer:
          "An isolated system is one that does not exchange energy or matter with its surroundings.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the First Law of Thermodynamics?",
        answer:
          "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Define internal energy.",
        answer:
          "Internal energy is the total energy contained within a system, including both kinetic and potential energies of its particles.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the difference between heat and temperature?",
        answer:
          "Heat is the transfer of thermal energy between substances, while temperature is a measure of the average kinetic energy of particles in a substance.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Explain thermal equilibrium.",
        answer:
          "Thermal equilibrium occurs when two objects in contact no longer exchange heat, reaching the same temperature.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is a thermodynamic system?",
        answer:
          "A thermodynamic system is a defined region in space or a collection of matter where energy and matter interactions are studied.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does the Second Law of Thermodynamics define the direction of heat transfer?",
        answer:
          "The Second Law of Thermodynamics states that heat naturally flows from a hotter object to a cooler object, and not the other way around, unless external work is applied.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is entropy, and why is it important in thermodynamics?",
        answer:
          "Entropy is a measure of the disorder or randomness in a system. It is important because it helps determine the feasibility and direction of natural processes in thermodynamic systems.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Explain the concept of enthalpy in thermodynamic processes.",
        answer:
          "Enthalpy is the total heat content of a system, defined as the internal energy plus the product of pressure and volume. It helps in understanding energy changes in processes that occur at constant pressure.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is a Carnot engine, and why is it ideal?",
        answer:
          "A Carnot engine is a theoretical heat engine with maximum efficiency, operating between two heat reservoirs. It is ideal because it represents the highest possible efficiency a heat engine can achieve, based on the Second Law of Thermodynamics.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Describe the process of adiabatic expansion in gases.",
        answer:
          "In adiabatic expansion, a gas expands without exchanging heat with its surroundings. As it expands, the gas does work, which decreases its internal energy and temperature.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does specific heat capacity affect the temperature change of a substance?",
        answer:
          "Specific heat capacity is the amount of heat required to change the temperature of a unit mass by 1°C. Substances with higher specific heat require more energy to change their temperature, affecting how quickly they heat up or cool down.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is a heat pump, and how does it differ from a heat engine?",
        answer:
          "A heat pump transfers heat from a colder area to a warmer area by doing work, whereas a heat engine converts heat into work by moving heat from a hotter region to a cooler one.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Explain the difference between an isothermal and an adiabatic process.",
        answer:
          "In an isothermal process, the temperature remains constant while energy is exchanged with surroundings. In an adiabatic process, no heat is exchanged, and temperature changes occur due to internal work.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What role does the Third Law of Thermodynamics play in absolute zero temperature?",
        answer:
          "The Third Law of Thermodynamics states that as temperature approaches absolute zero, the entropy of a perfect crystal also approaches zero, meaning it becomes perfectly ordered.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does a refrigerator use thermodynamic principles to cool its interior?",
        answer:
          "A refrigerator uses a refrigerant that absorbs heat from the interior and releases it outside by compressing and expanding the refrigerant, following the principles of thermodynamics to move heat against its natural flow.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does the concept of Gibbs free energy determine the spontaneity of a reaction?",
        answer:
          "Gibbs free energy (G) combines enthalpy and entropy to determine reaction spontaneity. If ΔG is negative, the reaction is spontaneous. It is calculated as ΔG = ΔH - TΔS, where T is the temperature in Kelvin.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Explain how the Maxwell-Boltzmann distribution is used to describe the behavior of gas particles.",
        answer:
          "The Maxwell-Boltzmann distribution describes the distribution of speeds among gas particles, indicating that most particles have speeds around a certain average but with some slower and faster ones, helping to explain pressure and temperature at a molecular level.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the Clausius-Clapeyron equation, and how is it used in phase transitions?",
        answer:
          "The Clausius-Clapeyron equation relates the pressure and temperature during a phase change, particularly between liquid and gas phases. It is used to estimate vapor pressure changes with temperature.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Discuss the concept of Helmholtz free energy and its application in closed thermodynamic systems.",
        answer:
          "Helmholtz free energy (A) is the energy available to do work in a system at constant temperature and volume. It is used to determine the maximum work extractable from a closed system and is calculated as A = U - TS.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does the concept of fugacity improve the ideal gas law for real gases?",
        answer:
          "Fugacity modifies the ideal gas law for real gases by accounting for intermolecular forces and volume exclusions. It approximates the 'effective' pressure that a real gas exerts, making calculations more accurate at high pressures and low temperatures.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Explain the process of entropy generation in irreversible thermodynamic processes.",
        answer:
          "In irreversible processes, entropy generation occurs due to factors like friction, unrestrained expansion, and heat transfer through a finite temperature difference. This entropy generation increases the overall disorder of the universe.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the significance of the Van der Waals equation in explaining real gas behavior?",
        answer:
          "The Van der Waals equation accounts for intermolecular forces and molecular volume in real gases, improving upon the ideal gas law. It explains why real gases deviate from ideal behavior at high pressures and low temperatures.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does Le Chatelier's principle relate to thermodynamic equilibrium and pressure changes?",
        answer:
          "Le Chatelier's principle states that if an equilibrium system experiences a change (e.g., in pressure), it will shift to counteract that change. For instance, increasing pressure favors the side with fewer gas molecules, impacting the reaction's equilibrium position.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Describe the Joule-Thomson effect and its implications for gas liquefaction.",
        answer:
          "The Joule-Thomson effect describes how a gas's temperature changes when it expands without exchanging heat. Gases like nitrogen cool when expanded under certain conditions, a principle used in gas liquefaction.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "How does the Nernst Heat Theorem relate to the Third Law of Thermodynamics?",
        answer:
          "The Nernst Heat Theorem states that as a system approaches absolute zero, the entropy change approaches zero. This aligns with the Third Law, implying that perfect crystals have minimal entropy at absolute zero.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
    ];
    await Descriptive.insertMany(thermodynamicDescriptiveQuestions);

    const electromagentismDescriptiveQuestions = [
      {
        text: "What is electromagnetism?",
        answer:
          "Electromagnetism is the branch of physics that studies the interaction between electric charges and magnetic fields.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Define electric charge.",
        answer:
          "Electric charge is a property of particles that causes them to experience a force when placed in an electric or magnetic field.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is a magnetic field?",
        answer:
          "A magnetic field is a region around a magnet where magnetic forces can be detected, and it exerts a force on other magnets and magnetic materials.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain Coulomb's Law.",
        answer:
          "Coulomb's Law states that the force between two charged objects is directly proportional to the product of their charges and inversely proportional to the square of the distance between them.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is an electric field?",
        answer:
          "An electric field is a region around a charged particle where an electric force is exerted on other charged particles.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is meant by the term 'current' in electricity?",
        answer:
          "Current is the flow of electric charge through a conductor, typically measured in amperes (A).",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is Ohm's Law?",
        answer:
          "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points and inversely proportional to the resistance.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Define resistance in an electrical circuit.",
        answer:
          "Resistance is the opposition to the flow of electric current in a material, measured in ohms (Ω).",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is a conductor?",
        answer:
          "A conductor is a material that allows electric charges to flow through it easily, typically metals like copper or aluminum.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the difference between a conductor and an insulator?",
        answer:
          "A conductor allows electric current to flow easily, while an insulator resists the flow of electric current.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is electromagnetic induction and who discovered it?",
        answer:
          "Electromagnetic induction is the process by which a changing magnetic field creates an electric current in a conductor. It was discovered by Michael Faraday.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain the Right-Hand Rule in electromagnetism.",
        answer:
          "The Right-Hand Rule is used to determine the direction of the magnetic field around a current-carrying wire. When the thumb points in the direction of current, the curled fingers show the direction of the magnetic field.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the difference between electric and magnetic fields?",
        answer:
          "An electric field is produced by stationary charges and exerts force on other electric charges, while a magnetic field is produced by moving charges and exerts force on other moving charges and magnetic materials.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Describe what a solenoid is and how it creates a magnetic field.",
        answer:
          "A solenoid is a coil of wire that produces a magnetic field when an electric current passes through it. The field is strongest and most uniform inside the coil.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is Lenz's Law, and how does it relate to the direction of induced current?",
        answer:
          "Lenz's Law states that the direction of an induced current is such that it opposes the change in the magnetic field that caused it, conserving energy by opposing the original change.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Define magnetic flux and provide its unit of measurement.",
        answer:
          "Magnetic flux is the measure of the total magnetic field passing through a given area, measured in Weber (Wb). It is calculated as the product of the magnetic field and the perpendicular area.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain how a transformer works and its purpose.",
        answer:
          "A transformer uses electromagnetic induction to increase or decrease AC voltage by transferring energy between two coils (primary and secondary) through a changing magnetic field.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "How does a moving charge create a magnetic field?",
        answer:
          "A moving charge creates a magnetic field around it due to its motion. The direction and magnitude of this field depend on the direction and speed of the charge's motion.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the Biot-Savart Law and what does it describe?",
        answer:
          "The Biot-Savart Law describes the magnetic field generated by a moving electric current, providing a mathematical formula to calculate the magnetic field at a given point around the current-carrying conductor.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Describe the function of a capacitor in an electric circuit.",
        answer:
          "A capacitor stores electrical energy in an electric field and releases it when needed, commonly used for smoothing voltage fluctuations and energy storage in circuits.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain the concept of electromagnetic wave propagation and how electric and magnetic fields interact in this process.",
        answer:
          "Electromagnetic wave propagation occurs when oscillating electric and magnetic fields travel through space perpendicular to each other. The changing electric field generates a magnetic field, and vice versa, allowing the wave to self-propagate.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "How does Faraday's Law of Induction apply to the working of an electric generator?",
        answer:
          "Faraday's Law states that a changing magnetic field induces an electromotive force (EMF) in a conductor. In an electric generator, the rotation of coils within a magnetic field causes a change in magnetic flux, inducing an EMF and generating electric current.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is Ampere's Circuital Law and how is it applied to calculate the magnetic field around a current-carrying conductor?",
        answer:
          "Ampere's Circuital Law states that the line integral of the magnetic field around a closed loop is proportional to the electric current passing through the loop. It is used to calculate magnetic fields in situations with symmetrical current distributions.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Describe the phenomenon of magnetic hysteresis and its significance in electromagnetism.",
        answer:
          "Magnetic hysteresis is the lag between changes in magnetization and the magnetic field applied. It occurs in ferromagnetic materials and results in energy loss as heat, significant in transformers and inductors where cyclic magnetization is common.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "How does the Poynting vector represent the flow of electromagnetic energy?",
        answer:
          "The Poynting vector represents the directional energy flux (the rate of energy transfer per unit area) of an electromagnetic field. It is the cross-product of the electric and magnetic fields, showing the direction and magnitude of energy flow.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain the principle of superconductivity and its electromagnetic properties.",
        answer:
          "Superconductivity is a phenomenon where certain materials exhibit zero electrical resistance and expel magnetic fields below a critical temperature. This results in perfect conductivity and the Meissner effect, where magnetic fields are expelled from the material.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "How does the Lorentz force affect a charged particle moving in both electric and magnetic fields?",
        answer:
          "The Lorentz force is the combined force exerted on a charged particle by electric and magnetic fields. It is given by F = q(E + v × B), where E is the electric field, B is the magnetic field, and v is the particle's velocity, causing the particle to spiral or curve.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What are Maxwell's equations, and how do they unify electricity and magnetism?",
        answer:
          "Maxwell's equations are four fundamental laws that describe the behavior of electric and magnetic fields. They unify electricity and magnetism by showing that changing electric fields produce magnetic fields and vice versa, forming the basis for electromagnetic wave theory.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Discuss the phenomenon of eddy currents and their practical applications and drawbacks.",
        answer:
          "Eddy currents are loops of electric current induced within conductors by changing magnetic fields. They have practical applications in braking systems and metal detectors but can cause energy losses and heating in transformers and motors.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Explain how the concept of magnetic flux quantization is related to superconducting materials.",
        answer:
          "In superconductors, magnetic flux is quantized, meaning it can only exist in discrete units called flux quanta. This phenomenon arises due to the superconducting material's quantum properties and has implications for magnetic field penetration in Type II superconductors.",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
    ];
    await Descriptive.insertMany(electromagentismDescriptiveQuestions);

    const organicChemistryDescriptiveQuestions = [
      {
        text: "What is organic chemistry?",
        answer:
          "Organic chemistry is the branch of chemistry that studies the structure, properties, composition, reactions, and synthesis of carbon-containing compounds.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Define hydrocarbons.",
        answer:
          "Hydrocarbons are organic compounds composed only of hydrogen and carbon atoms.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What are alkanes?",
        answer:
          "Alkanes are a class of hydrocarbons that contain only single bonds between carbon atoms, and are also called saturated hydrocarbons.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the general formula for alkanes?",
        answer:
          "The general formula for alkanes is CnH2n+2, where 'n' is the number of carbon atoms.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What are functional groups in organic chemistry?",
        answer:
          "Functional groups are specific groups of atoms within molecules that are responsible for the characteristic chemical reactions of those molecules.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Define isomers.",
        answer:
          "Isomers are compounds with the same molecular formula but different structural arrangements of atoms.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is an alcohol in organic chemistry?",
        answer:
          "An alcohol is an organic compound that contains one or more hydroxyl (-OH) groups attached to a carbon atom.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the simplest alkane?",
        answer:
          "The simplest alkane is methane (CH4), which consists of one carbon atom bonded to four hydrogen atoms.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the difference between saturated and unsaturated hydrocarbons?",
        answer:
          "Saturated hydrocarbons contain only single bonds between carbon atoms, while unsaturated hydrocarbons contain at least one double or triple bond.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What are alkenes?",
        answer:
          "Alkenes are a class of hydrocarbons that contain at least one double bond between carbon atoms.",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the structural difference between alkanes, alkenes, and alkynes?",
        answer:
          "Alkanes contain only single bonds between carbon atoms, alkenes have at least one double bond, and alkynes contain at least one triple bond.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Explain the concept of isomerism with an example.",
        answer:
          "Isomerism occurs when compounds have the same molecular formula but different structures. For example, butane (C4H10) has two isomers: n-butane and isobutane.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What are aromatic hydrocarbons? Provide an example.",
        answer:
          "Aromatic hydrocarbons are compounds that contain a benzene ring or similar ring structure with delocalized electrons. Benzene (C6H6) is an example.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Describe the functional group in an aldehyde and give an example.",
        answer:
          "Aldehydes contain a carbonyl group (C=O) attached to at least one hydrogen atom. Formaldehyde (CH2O) is an example.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What are amines, and how are they classified?",
        answer:
          "Amines are organic compounds containing a nitrogen atom bonded to one or more alkyl or aryl groups. They are classified as primary, secondary, or tertiary based on the number of carbon groups attached to nitrogen.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "How do you distinguish between a primary, secondary, and tertiary alcohol?",
        answer:
          "A primary alcohol has the -OH group attached to a carbon atom with two hydrogens, a secondary to a carbon with one hydrogen, and a tertiary to a carbon with no hydrogens.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the IUPAC naming rule for branched alkanes?",
        answer:
          "The IUPAC rule for naming branched alkanes involves identifying the longest continuous chain as the base name and numbering it to give the lowest possible numbers to substituents.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Define stereoisomers and give an example.",
        answer:
          "Stereoisomers are compounds with the same molecular and structural formulas but different spatial arrangements of atoms. Cis-2-butene and trans-2-butene are examples.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is a nucleophile and how does it participate in a reaction?",
        answer:
          "A nucleophile is an atom or molecule that donates an electron pair to form a chemical bond, commonly attacking electrophiles in substitution or addition reactions.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Explain the Markovnikov's rule in organic chemistry.",
        answer:
          "Markovnikov's rule states that, in the addition of a polar molecule to an alkene, the hydrogen atom attaches to the carbon with more hydrogens, and the other part to the carbon with fewer hydrogens.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Explain the mechanism of the Aldol condensation reaction and its significance in organic synthesis.",
        answer:
          "In the Aldol condensation, an enolate ion attacks the carbonyl carbon of another molecule, leading to the formation of a β-hydroxy aldehyde or ketone. This product can undergo dehydration to yield an α,β-unsaturated carbonyl compound, important in carbon–carbon bond formation.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is retrosynthesis, and how is it applied in organic chemistry?",
        answer:
          "Retrosynthesis is a method of solving complex organic synthesis problems by breaking down target molecules into simpler precursor structures. It helps chemists determine the sequence of reactions needed to synthesize a compound.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Describe the stereoelectronic effects in SN1 and SN2 reactions and their impact on reaction pathways.",
        answer:
          "Stereoelectronic effects influence how electrons are distributed and move in reaction pathways. SN1 reactions involve a carbocation intermediate and often lead to racemization, while SN2 reactions are stereospecific, inverting the configuration due to backside attack.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "How do you determine the major product in an electrophilic aromatic substitution reaction?",
        answer:
          "The major product depends on substituent effects. Activating groups (electron-donating) direct substitution to ortho/para positions, while deactivating groups (electron-withdrawing) favor meta positions. Resonance and inductive effects must be considered to predict the outcome.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Explain the concept of aromaticity and the criteria required for a compound to be aromatic.",
        answer:
          "Aromaticity is a property of cyclic, planar structures with delocalized π electrons that follow Huckel's rule (4n+2 π electrons). It stabilizes compounds by allowing resonance and enhances reactivity in certain reactions.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the mechanism of the Claisen rearrangement, and why is it important in organic synthesis?",
        answer:
          "The Claisen rearrangement is a [3,3]-sigmatropic rearrangement where an allyl vinyl ether transforms into a γ,δ-unsaturated carbonyl compound. It is thermally induced, highly selective, and useful for creating C–C bonds in synthetic routes.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "How does the E/Z isomerism differ from R/S stereoisomerism, and what are the rules for assigning each?",
        answer:
          "E/Z isomerism describes geometric isomers in compounds with double bonds, assigned based on the priority of substituents on each side of the double bond. R/S stereoisomerism applies to chiral centers and is determined by the Cahn-Ingold-Prelog priority rules.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the mechanism of the Wittig reaction, and how does it produce alkenes?",
        answer:
          "The Wittig reaction involves the reaction of a phosphonium ylide with a carbonyl compound, yielding an alkene. The mechanism includes nucleophilic attack by the ylide and formation of a four-membered oxaphosphetane intermediate, which decomposes to form the alkene.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Explain how the concept of hyperconjugation stabilizes carbocations.",
        answer:
          "Hyperconjugation is the delocalization of electrons in sigma bonds (usually C-H) adjacent to a carbocation. This overlap of sigma bonds with the empty p-orbital of the carbocation helps distribute the positive charge and increase stability.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Describe the Robinson annulation reaction and its importance in the synthesis of six-membered rings.",
        answer:
          "The Robinson annulation is a reaction sequence that combines a Michael addition and an intramolecular aldol condensation to form six-membered rings. It is widely used in natural product synthesis to construct complex cyclic compounds.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
    ];
    await Descriptive.insertMany(organicChemistryDescriptiveQuestions);

    const chemicalBondingDescriptiveQuestions = [
      {
        text: "What is a chemical bond?",
        answer:
          "A chemical bond is a lasting attraction between atoms that enables the formation of chemical compounds.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What are the two main types of chemical bonds?",
        answer:
          "The two main types of chemical bonds are ionic bonds and covalent bonds.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is an ionic bond?",
        answer:
          "An ionic bond is a type of chemical bond formed through the electrostatic attraction between positively and negatively charged ions.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is a covalent bond?",
        answer:
          "A covalent bond is a type of chemical bond formed when two atoms share one or more pairs of electrons.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What are valence electrons?",
        answer:
          "Valence electrons are the electrons in the outermost shell of an atom that are involved in forming chemical bonds.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the octet rule?",
        answer:
          "The octet rule states that atoms tend to bond in such a way that they have eight electrons in their valence shell, achieving a stable electronic configuration.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does electronegativity affect bond formation?",
        answer:
          "Electronegativity is a measure of an atom's ability to attract electrons. In bond formation, differences in electronegativity between atoms can determine whether a bond is ionic or covalent.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is a polar covalent bond?",
        answer:
          "A polar covalent bond is a type of covalent bond where the electrons are shared unequally between the two atoms, resulting in a partial positive charge on one atom and a partial negative charge on the other.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is a nonpolar covalent bond?",
        answer:
          "A nonpolar covalent bond is a type of covalent bond where the electrons are shared equally between the two atoms, resulting in no charge difference across the bond.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What role do chemical bonds play in forming compounds?",
        answer:
          "Chemical bonds hold atoms together in compounds, determining the compound's structure and properties.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What factors determine the type of bond that forms between two atoms?",
        answer:
          "The type of bond that forms between two atoms is determined by their electronegativity difference, ionization energy, and the number of valence electrons. Generally, a large electronegativity difference leads to ionic bonds, while similar electronegativities favor covalent bonding.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Describe the differences between single, double, and triple covalent bonds.",
        answer:
          "Single covalent bonds involve one pair of shared electrons, double covalent bonds involve two pairs of shared electrons, and triple covalent bonds involve three pairs of shared electrons. The number of shared electron pairs increases bond strength and decreases bond length.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does the concept of resonance explain the structure of certain molecules?",
        answer:
          "Resonance describes the situation where a molecule can be represented by two or more valid Lewis structures. This concept explains that the actual structure is a hybrid of these structures, resulting in delocalized electrons and increased stability.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the role of hybridization in the formation of chemical bonds?",
        answer:
          "Hybridization is the process of mixing atomic orbitals to form new hybrid orbitals that can accommodate bonding electrons. It explains the geometry and bonding properties of molecules, such as sp³ hybridization leading to tetrahedral shapes.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Explain the concept of lattice energy and its significance in ionic compounds.",
        answer:
          "Lattice energy is the energy released when gaseous ions combine to form an ionic solid. It is a measure of the strength of the ionic bonds in a compound; higher lattice energy indicates stronger bonds and greater stability of the ionic solid.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is a dipole moment, and how does it relate to molecular polarity?",
        answer:
          "A dipole moment is a measure of the separation of positive and negative charges in a molecule. It indicates the polarity of a bond or molecule; molecules with significant dipole moments are polar, while those with zero dipole moments are nonpolar.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does the geometry of a molecule influence its physical and chemical properties?",
        answer:
          "The geometry of a molecule affects its polarity, reactivity, phase of matter, color, magnetism, and biological activity. For example, polar molecules tend to have higher boiling points due to stronger intermolecular forces compared to nonpolar molecules.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the significance of the octet rule in covalent bonding?",
        answer:
          "The octet rule states that atoms tend to form bonds in such a way that they achieve a full valence shell of eight electrons. This rule helps predict how atoms will bond and the types of molecules they will form to attain stability.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Explain the difference between sigma and pi bonds.",
        answer:
          "Sigma bonds are formed by the head-on overlap of atomic orbitals and can occur between any two orbitals, while pi bonds are formed by the side-to-side overlap of p orbitals. Sigma bonds are generally stronger than pi bonds and are present in all single bonds.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does temperature affect the strength of chemical bonds?",
        answer:
          "As temperature increases, the kinetic energy of atoms and molecules also increases, which can weaken chemical bonds. Higher temperatures may lead to increased bond vibrations, making it easier for bonds to break, thus affecting reaction rates and equilibrium.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Discuss the concept of bond order and how it relates to bond strength and stability.",
        answer:
          "Bond order is defined as the number of bonding pairs of electrons between two atoms. Higher bond order indicates stronger bonds and greater stability; for example, a triple bond (bond order of 3) is stronger and shorter than a single bond (bond order of 1).",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Explain how molecular orbital theory differs from valence bond theory in describing chemical bonding.",
        answer:
          "Molecular orbital theory posits that atomic orbitals combine to form molecular orbitals that can be occupied by electrons of the entire molecule, allowing for delocalization. In contrast, valence bond theory focuses on localized electron pairs between atoms, emphasizing hybridization and bond formation between individual atomic orbitals.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the significance of the electronegativity scale in predicting bond character?",
        answer:
          "The electronegativity scale quantifies an atom's ability to attract electrons. By comparing electronegativities, one can predict the nature of a bond (ionic, polar covalent, or nonpolar covalent). Large differences in electronegativity typically result in ionic bonds, while smaller differences indicate covalent character.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does the presence of lone pairs of electrons affect molecular geometry?",
        answer:
          "Lone pairs of electrons occupy space around the central atom and can cause repulsion that alters the ideal bond angles, leading to distorted geometries. For example, in water (H₂O), the two lone pairs reduce the bond angle between the hydrogen atoms from the tetrahedral angle of 109.5° to about 104.5°.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Describe how intermolecular forces differ from intramolecular forces and their implications for physical properties.",
        answer:
          "Intramolecular forces are the forces that hold atoms together within a molecule (such as covalent or ionic bonds), while intermolecular forces are the forces between molecules (such as hydrogen bonds, dipole-dipole interactions, and London dispersion forces). Intermolecular forces affect physical properties like boiling and melting points, solubility, and volatility.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What role do d-orbitals play in bonding for transition metals?",
        answer:
          "D-orbitals can participate in bonding for transition metals by forming coordination complexes and contributing to hybridization. Their ability to accommodate multiple oxidation states and engage in π-backbonding significantly affects the chemical behavior and properties of transition metal complexes.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How does hybridization influence the properties of organic compounds?",
        answer:
          "Hybridization determines the geometry, bond angles, and type of bonding in organic compounds. For example, sp² hybridization leads to trigonal planar geometry and the formation of π bonds, impacting reactivity and stability in compounds like alkenes and aromatic systems.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Discuss the concept of electron delocalization and its importance in resonance structures.",
        answer:
          "Electron delocalization occurs when electrons are shared among several atoms rather than localized between two. It is significant in resonance structures because it contributes to the stability of molecules (like benzene) and explains their unique properties, such as equal bond lengths and lower reactivity.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the relationship between bond length and bond strength in different types of bonds?",
        answer:
          "Generally, shorter bond lengths correspond to stronger bonds due to greater overlap of atomic orbitals. For instance, triple bonds are shorter and stronger than double bonds, which in turn are shorter and stronger than single bonds. However, bond length is also influenced by atomic size and other factors.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How can the concept of molecular symmetry affect the polarity of a molecule?",
        answer:
          "Molecular symmetry affects polarity by determining the distribution of charge across the molecule. Symmetrical molecules, even with polar bonds, can be nonpolar overall due to the cancellation of dipole moments. Conversely, asymmetrical molecules tend to be polar, resulting in a net dipole moment.",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
    ];
    await Descriptive.insertMany(chemicalBondingDescriptiveQuestions);

    const consumerBehaviorDescriptiveQuestions = [
      {
        text: "What is consumer behavior?",
        answer:
          "Consumer behavior refers to the study of how individuals make decisions to spend their available resources, such as time, money, and effort, on consumption-related items.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What factors influence consumer buying decisions?",
        answer:
          "Factors influencing consumer buying decisions include personal preferences, social influences, cultural factors, psychological aspects, and economic conditions.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the role of marketing in influencing consumer behavior?",
        answer:
          "Marketing plays a crucial role in influencing consumer behavior by creating awareness, generating interest, and persuading consumers through advertising, promotions, and branding strategies.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do consumers perceive product quality?",
        answer:
          "Consumers perceive product quality based on their experiences, brand reputation, price, and reviews or recommendations from others, which can influence their purchase decisions.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is brand loyalty?",
        answer:
          "Brand loyalty refers to a consumer's commitment to repurchase or continue using a brand, often leading to repeat purchases and positive word-of-mouth recommendations.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the difference between needs and wants in consumer behavior?",
        answer:
          "Needs are essential requirements for survival, such as food, clothing, and shelter, while wants are desires for specific products or services that fulfill those needs.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does advertising affect consumer behavior?",
        answer:
          "Advertising affects consumer behavior by creating awareness of products, shaping perceptions, influencing attitudes, and prompting consumers to take action toward purchasing.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role do social factors play in consumer behavior?",
        answer:
          "Social factors, including family, friends, and social media, play a significant role in consumer behavior by influencing preferences, opinions, and purchasing decisions.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the decision-making process in consumer behavior?",
        answer:
          "The decision-making process in consumer behavior typically involves five stages: problem recognition, information search, evaluation of alternatives, purchase decision, and post-purchase behavior.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the significance of consumer feedback in marketing?",
        answer:
          "Consumer feedback is significant in marketing as it helps businesses understand customer satisfaction, identify areas for improvement, and make informed decisions to enhance products and services.",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do cultural factors shape consumer preferences?",
        answer:
          "Cultural factors shape consumer preferences by influencing values, beliefs, and behaviors. These factors include culture, subculture, and social class, which determine how consumers perceive products and make purchasing decisions.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What are the psychological influences on consumer behavior?",
        answer:
          "Psychological influences on consumer behavior include motivation, perception, learning, beliefs, and attitudes. These factors affect how consumers interpret information and how they make choices.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does social media impact consumer buying behavior?",
        answer:
          "Social media impacts consumer buying behavior by facilitating peer influence, enabling product discovery, and providing platforms for sharing reviews and experiences, thereby shaping brand perceptions and purchase intentions.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the importance of customer segmentation in marketing strategies?",
        answer:
          "Customer segmentation is important in marketing strategies as it allows businesses to tailor their marketing efforts to specific groups based on demographics, psychographics, behavior, and needs, leading to more effective targeting and increased customer satisfaction.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do consumers evaluate alternatives before making a purchase?",
        answer:
          "Consumers evaluate alternatives by comparing features, benefits, prices, and quality among different products or brands. They may also consider personal experiences, recommendations, and brand reputation during this evaluation process.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role does emotional branding play in consumer loyalty?",
        answer:
          "Emotional branding plays a crucial role in consumer loyalty by creating strong emotional connections between the brand and consumers. Brands that evoke positive emotions can enhance customer satisfaction and encourage repeat purchases.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the impact of pricing strategies on consumer behavior?",
        answer:
          "Pricing strategies can significantly impact consumer behavior by influencing perceived value, demand elasticity, and consumer willingness to pay. Strategies like discounting, price anchoring, and premium pricing can affect purchasing decisions.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does the concept of cognitive dissonance affect post-purchase behavior?",
        answer:
          "Cognitive dissonance occurs when consumers experience doubt or discomfort after making a purchase decision. This can lead to post-purchase behavior such as seeking reassurance, justifying the purchase, or returning the product if dissatisfaction arises.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What factors contribute to impulse buying behavior among consumers?",
        answer:
          "Factors contributing to impulse buying behavior include emotional triggers, promotional offers, product placement, and social influences. Environmental cues, such as store ambiance and marketing tactics, can also stimulate spontaneous purchases.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How can companies use customer feedback to improve their products or services?",
        answer:
          "Companies can use customer feedback to identify strengths and weaknesses in their products or services, prioritize improvements based on customer needs, and enhance customer satisfaction by addressing issues highlighted by consumers.",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does consumer involvement affect decision-making processes in high-stakes purchases?",
        answer:
          "Consumer involvement refers to the level of interest or personal relevance a consumer perceives in a purchase decision. High involvement typically leads to extensive information search and careful evaluation of alternatives, especially in high-stakes purchases such as cars or homes.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the role of heuristic decision-making in consumer behavior?",
        answer:
          "Heuristic decision-making involves using mental shortcuts or rules of thumb to simplify the decision-making process. Consumers may rely on heuristics, such as brand loyalty or price as a quality indicator, particularly in situations with limited information or time.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "In what ways can social proof influence consumer choices in a digital environment?",
        answer:
          "Social proof can influence consumer choices in a digital environment through online reviews, testimonials, social media endorsements, and the visibility of consumer interactions. Positive feedback from peers can enhance credibility and encourage potential buyers to adopt similar behaviors.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does the theory of planned behavior explain the relationship between attitudes and consumer actions?",
        answer:
          "The theory of planned behavior posits that behavioral intentions are influenced by attitudes toward the behavior, subjective norms, and perceived behavioral control. This theory explains that positive attitudes towards a product, combined with social pressures and confidence in the ability to purchase, can lead to actual consumer actions.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What impact do psychological reactance and scarcity have on consumer behavior?",
        answer:
          "Psychological reactance occurs when consumers feel their freedom to choose is threatened, often leading to increased desire for the restricted option. Scarcity, such as limited-time offers, can amplify this reactance and drive consumers to make quicker purchasing decisions to avoid missing out.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do cultural dimensions, as proposed by Hofstede, influence consumer preferences across different countries?",
        answer:
          "Hofstede's cultural dimensions, such as individualism vs. collectivism and uncertainty avoidance, influence consumer preferences by shaping values and behaviors. For example, collectivist cultures may prefer products that emphasize family or community benefits, while individualist cultures may prioritize personal success and individual choice.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What are the implications of behavioral economics on consumer decision-making?",
        answer:
          "Behavioral economics examines how psychological, cognitive, and emotional factors affect consumer decision-making, often leading to irrational behaviors. Concepts such as loss aversion, mental accounting, and anchoring can impact how consumers perceive value and make choices.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does brand equity affect consumer loyalty and purchasing behavior?",
        answer:
          "Brand equity, the value added to a product by having a well-known brand name, affects consumer loyalty by fostering trust and perceived quality. Higher brand equity can lead to repeat purchases, reduced price sensitivity, and positive word-of-mouth recommendations.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role does the concept of 'choice overload' play in consumer satisfaction?",
        answer:
          "Choice overload refers to the phenomenon where consumers are overwhelmed by too many options, leading to anxiety and dissatisfaction. It can result in decision paralysis, lower satisfaction with the final choice, and regret post-purchase, as consumers may doubt whether they made the best decision.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do situational factors, such as store atmosphere and layout, impact consumer buying behavior?",
        answer:
          "Situational factors, including store atmosphere (lighting, music, scents) and layout (product placement, flow), can significantly impact consumer buying behavior by influencing mood, perceptions of quality, and ease of navigation, ultimately affecting purchase intentions and spending.",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
    ];
    await Descriptive.insertMany(consumerBehaviorDescriptiveQuestions);

    const brandManagementDescriptiveQuestions = [
      {
        text: "What is brand management?",
        answer:
          "Brand management is the process of developing, maintaining, and enhancing a brand's image, reputation, and overall value to ensure it resonates with the target audience and stands out in the market.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Why is brand identity important?",
        answer:
          "Brand identity is important because it represents how a brand wants to be perceived by consumers and helps differentiate it from competitors, influencing customer loyalty and trust.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What are brand values?",
        answer:
          "Brand values are the core principles and beliefs that guide a brand's behavior, decisions, and actions, reflecting what the brand stands for and influencing its relationship with customers.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a brand logo?",
        answer:
          "A brand logo is a visual symbol or design that represents a brand, helping to create recognition and convey the brand's identity and values to consumers.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a target market in brand management?",
        answer:
          "A target market in brand management is a specific group of consumers identified as the intended audience for a brand's products or services based on demographics, interests, and behaviors.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What role does brand positioning play?",
        answer:
          "Brand positioning plays a critical role in defining how a brand is perceived in the marketplace relative to its competitors, helping to create a unique space in consumers' minds.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is brand equity?",
        answer:
          "Brand equity refers to the value a brand adds to a product or service based on consumer perception, recognition, and loyalty, influencing pricing and market success.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a brand ambassador?",
        answer:
          "A brand ambassador is an individual, often a celebrity or influencer, who represents and promotes a brand, helping to enhance its image and reach through their endorsement.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can storytelling enhance brand management?",
        answer:
          "Storytelling can enhance brand management by creating emotional connections with consumers, making the brand more relatable and memorable, and conveying its values and mission in an engaging way.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the primary purpose of brand management?",
        answer:
          "To control and improve the perception of a brand in the market.",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How does effective brand management contribute to a company's competitive advantage?",
        answer:
          "Effective brand management contributes to a company's competitive advantage by fostering customer loyalty, enhancing brand reputation, and creating perceived value, which can differentiate the brand in a crowded marketplace.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What strategies can companies use to reposition their brand in the market?",
        answer:
          "Companies can use strategies such as redefining brand values, altering target demographics, refreshing brand messaging, and adjusting product offerings to reposition their brand in the market effectively.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can social media influence brand management?",
        answer:
          "Social media influences brand management by providing platforms for direct consumer engagement, real-time feedback, brand storytelling, and targeted advertising, shaping public perception and brand reputation.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the significance of a brand's visual identity?",
        answer:
          "A brand's visual identity is significant because it encompasses elements like logos, colors, and typography, which create a recognizable and consistent image that resonates with consumers and reinforces brand messaging.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can companies measure brand health and performance?",
        answer:
          "Companies can measure brand health and performance through metrics such as brand awareness, customer perception surveys, social media engagement, net promoter score (NPS), and market share analysis.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the role of customer feedback in brand management?",
        answer:
          "Customer feedback plays a crucial role in brand management by providing insights into consumer preferences and satisfaction, allowing brands to adapt strategies, improve products, and enhance customer experiences.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can brands effectively manage crises and protect their reputation?",
        answer:
          "Brands can effectively manage crises by preparing crisis communication plans, responding quickly and transparently, taking accountability, and engaging with stakeholders to restore trust and mitigate reputational damage.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What are the implications of brand extension for brand equity?",
        answer:
          "Brand extension can have positive implications for brand equity by leveraging the established reputation of the parent brand to gain consumer trust, but it can also risk diluting the brand if the extension is poorly received.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How does brand storytelling differ from traditional advertising?",
        answer:
          "Brand storytelling differs from traditional advertising in that it focuses on creating narratives that engage consumers emotionally and foster connections, rather than simply promoting products or services through direct sales messages.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What challenges do brands face in maintaining consistency across multiple channels?",
        answer:
          "Brands face challenges in maintaining consistency across multiple channels due to varying platform requirements, audience expectations, and the need for cohesive messaging that aligns with the overall brand strategy.",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can the concept of brand architecture influence a company's overall branding strategy?",
        answer:
          "Brand architecture influences a company's overall branding strategy by defining the relationships between different brands and sub-brands within the portfolio, guiding positioning, resource allocation, and communication strategies to create clarity and maximize brand equity.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What role does emotional branding play in creating long-term customer loyalty?",
        answer:
          "Emotional branding plays a vital role in creating long-term customer loyalty by establishing deeper emotional connections with consumers, fostering a sense of belonging, and influencing purchasing decisions based on shared values and experiences.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "In what ways can cultural differences impact brand management strategies in global markets?",
        answer:
          "Cultural differences can impact brand management strategies in global markets by necessitating adaptations in messaging, branding elements, consumer engagement tactics, and product offerings to resonate with diverse cultural norms, values, and preferences.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can brands leverage data analytics to enhance their marketing effectiveness?",
        answer:
          "Brands can leverage data analytics to enhance marketing effectiveness by gaining insights into consumer behavior, preferences, and trends, enabling more targeted campaigns, personalization, and improved ROI through data-driven decision-making.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What challenges do brands face in managing their reputation in the age of social media?",
        answer:
          "Brands face challenges in managing their reputation in the age of social media due to the rapid spread of information, the potential for negative feedback going viral, and the difficulty in controlling brand narrative in a highly connected environment.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can strategic partnerships enhance brand equity and market presence?",
        answer:
          "Strategic partnerships can enhance brand equity and market presence by leveraging shared resources, expanding audience reach, combining strengths to create value propositions, and increasing credibility through association with reputable partners.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the significance of brand loyalty programs in retaining customers?",
        answer:
          "Brand loyalty programs are significant in retaining customers by incentivizing repeat purchases, enhancing customer engagement, fostering emotional connections, and providing valuable data on consumer preferences to tailor marketing efforts.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How do brand authenticity and transparency influence consumer trust?",
        answer:
          "Brand authenticity and transparency influence consumer trust by demonstrating the brand's commitment to honesty, ethical practices, and consistency in messaging and actions, which can lead to stronger emotional connections and loyalty.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What impact does sustainability have on modern brand management strategies?",
        answer:
          "Sustainability impacts modern brand management strategies by driving brands to adopt eco-friendly practices, communicate their commitment to social responsibility, and attract consumers who prioritize ethical consumption, ultimately enhancing brand reputation and loyalty.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can brands utilize influencer marketing while maintaining brand integrity?",
        answer:
          "Brands can utilize influencer marketing while maintaining brand integrity by carefully selecting influencers whose values align with the brand, establishing clear collaboration guidelines, and ensuring authenticity in sponsored content to foster genuine connections with consumers.",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
    ];
    await Descriptive.insertMany(brandManagementDescriptiveQuestions);

    const thermodynamicsMcqQuestions = [
      {
        text: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed.",
          "The entropy of an isolated system always increases.",
          "Heat is a form of energy transfer.",
          "All of the above.",
        ],
        answer: "Energy cannot be created or destroyed.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which of the following is an example of an exothermic process?",
        options: [
          "Melting ice.",
          "Evaporating water.",
          "Burning wood.",
          "Dissolving salt in water.",
        ],
        answer: "Burning wood.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the unit of temperature in the Kelvin scale?",
        options: [
          "Degrees Celsius.",
          "Degrees Fahrenheit.",
          "Kelvin.",
          "Joule.",
        ],
        answer: "Kelvin.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In which process does the temperature of a gas increase when it is compressed?",
        options: [
          "Isothermal process.",
          "Adiabatic process.",
          "Isobaric process.",
          "Isovolumetric process.",
        ],
        answer: "Adiabatic process.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the term for the amount of heat required to raise the temperature of a unit mass of a substance by one degree Celsius?",
        options: [
          "Thermal conductivity.",
          "Specific heat capacity.",
          "Latent heat.",
          "Enthalpy.",
        ],
        answer: "Specific heat capacity.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the primary focus of thermodynamics?",
        options: [
          "The study of energy transformations.",
          "The study of chemical reactions.",
          "The study of molecular structures.",
          "The study of electrical circuits.",
        ],
        answer: "The study of energy transformations.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which law states that the total entropy of an isolated system can never decrease over time?",
        options: [
          "Zeroth law of thermodynamics.",
          "First law of thermodynamics.",
          "Second law of thermodynamics.",
          "Third law of thermodynamics.",
        ],
        answer: "Second law of thermodynamics.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the term for the heat energy required to change a substance from solid to liquid at its melting point?",
        options: [
          "Sensible heat.",
          "Latent heat of fusion.",
          "Latent heat of vaporization.",
          "Specific heat.",
        ],
        answer: "Latent heat of fusion.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which of the following best describes an isothermal process?",
        options: [
          "Constant temperature process.",
          "Constant pressure process.",
          "Constant volume process.",
          "Constant energy process.",
        ],
        answer: "Constant temperature process.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What does the symbol 'Δ' represent in thermodynamics?",
        options: ["Heat.", "Work.", "Change.", "Temperature."],
        answer: "Change.",
        difficulty: "Easy",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What happens to the entropy of a system during an irreversible process?",
        options: [
          "It decreases.",
          "It increases.",
          "It remains constant.",
          "It can either increase or decrease.",
        ],
        answer: "It increases.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which thermodynamic process occurs at constant pressure?",
        options: [
          "Isothermal process.",
          "Isobaric process.",
          "Adiabatic process.",
          "Isochoric process.",
        ],
        answer: "Isobaric process.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In a heat engine, what is the term for the energy supplied to the engine?",
        options: [
          "Heat sink.",
          "Heat reservoir.",
          "Input heat.",
          "Output work.",
        ],
        answer: "Input heat.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the Carnot efficiency dependent on?",
        options: [
          "The specific heat capacities.",
          "The temperatures of the hot and cold reservoirs.",
          "The type of working substance.",
          "The pressure of the system.",
        ],
        answer: "The temperatures of the hot and cold reservoirs.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "During an isothermal expansion of an ideal gas, what happens to the internal energy?",
        options: [
          "It increases.",
          "It decreases.",
          "It remains constant.",
          "It becomes zero.",
        ],
        answer: "It remains constant.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the unit of work done in thermodynamics?",
        options: ["Joule.", "Calorie.", "Pascal.", "Liter."],
        answer: "Joule.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the term for the maximum efficiency that a heat engine can achieve operating between two temperatures?",
        options: [
          "Real efficiency.",
          "Ideal efficiency.",
          "Carnot efficiency.",
          "Mechanical efficiency.",
        ],
        answer: "Carnot efficiency.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In thermodynamics, what does the term 'enthalpy' represent?",
        options: [
          "Internal energy plus pressure times volume.",
          "Heat content of a system.",
          "Work done by a system.",
          "Total energy of a system.",
        ],
        answer: "Internal energy plus pressure times volume.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What type of process occurs when a gas expands against a constant external pressure?",
        options: ["Isothermal.", "Isobaric.", "Adiabatic.", "Isochoric."],
        answer: "Isobaric.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which of the following statements about heat and work is true?",
        options: [
          "Both are forms of energy transfer.",
          "Only heat is a form of energy.",
          "Work can be done without transferring energy.",
          "Heat can be measured in Joules only.",
        ],
        answer: "Both are forms of energy transfer.",
        difficulty: "Medium",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In a reversible isothermal expansion of an ideal gas, what is the relationship between the heat absorbed (Q) and the work done (W)?",
        options: ["Q = W.", "Q > W.", "Q < W.", "Q = 0."],
        answer: "Q = W.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which of the following statements about the Gibbs free energy (G) is correct?",
        options: [
          "G increases with temperature.",
          "G decreases for spontaneous processes.",
          "G is independent of pressure.",
          "G cannot be negative.",
        ],
        answer: "G decreases for spontaneous processes.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the significance of the critical point in a phase diagram?",
        options: [
          "It is the temperature and pressure at which the phases coexist.",
          "It indicates the end of the liquid-gas phase transition.",
          "It marks the point where the substance can exist in multiple phases.",
          "It is the temperature at which a substance becomes solid.",
        ],
        answer: "It indicates the end of the liquid-gas phase transition.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which thermodynamic cycle describes the operation of a Carnot engine?",
        options: [
          "Otto cycle.",
          "Brayton cycle.",
          "Rankine cycle.",
          "Carnot cycle.",
        ],
        answer: "Carnot cycle.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the change in Gibbs free energy (ΔG) at equilibrium?",
        options: ["ΔG < 0.", "ΔG > 0.", "ΔG = 0.", "ΔG is undefined."],
        answer: "ΔG = 0.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What is the main assumption of the ideal gas law?",
        options: [
          "Gas particles have no volume.",
          "Gas particles exert attractive forces on each other.",
          "All gas particles have the same mass.",
          "Gas particles are always in motion.",
        ],
        answer: "Gas particles have no volume.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In thermodynamics, which equation relates internal energy, heat, and work?",
        options: [
          "Bernoulli's equation.",
          "First law of thermodynamics.",
          "Ideal gas law.",
          "Enthalpy equation.",
        ],
        answer: "First law of thermodynamics.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "What does the term 'thermodynamic equilibrium' refer to?",
        options: [
          "The state where all macroscopic properties remain constant over time.",
          "The state where temperature and pressure are constant.",
          "The state where energy is conserved.",
          "The state where all phases coexist.",
        ],
        answer:
          "The state where all macroscopic properties remain constant over time.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "Which of the following is a consequence of the second law of thermodynamics?",
        options: [
          "Energy can be converted from one form to another without loss.",
          "Heat cannot spontaneously flow from a colder body to a hotter body.",
          "The total energy of a closed system remains constant.",
          "Work can be created from nothing.",
        ],
        answer:
          "Heat cannot spontaneously flow from a colder body to a hotter body.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
      {
        text: "In which process does the enthalpy of a system remain constant?",
        options: [
          "Adiabatic process.",
          "Isothermal process.",
          "Isobaric process.",
          "Isochoric process.",
        ],
        answer: "Isobaric process.",
        difficulty: "Hard",
        topic: topicMap["Thermodynamics"],
      },
    ];
    await Mcq.insertMany(thermodynamicsMcqQuestions);

    const electromagnetismMcqQuestions = [
      {
        text: "What is the unit of electric current?",
        options: ["Volt", "Ohm", "Ampere", "Coulomb"],
        answer: "Ampere",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the direction of the magnetic field around a straight current-carrying conductor?",
        options: [
          "From north to south",
          "From south to north",
          "Clockwise",
          "Counterclockwise",
        ],
        answer: "Circular around the conductor",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which of the following describes a magnetic field?",
        options: [
          "A region where electric charges are at rest.",
          "A region where electric charges experience a force.",
          "A region where light can travel.",
          "A region with no matter.",
        ],
        answer: "A region where electric charges experience a force.",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the relationship between voltage (V), current (I), and resistance (R) known as?",
        options: [
          "Ohm's Law",
          "Faraday's Law",
          "Ampere's Law",
          "Coulomb's Law",
        ],
        answer: "Ohm's Law",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which of the following materials is considered a good conductor of electricity?",
        options: ["Rubber", "Wood", "Copper", "Glass"],
        answer: "Copper",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What does a capacitor store?",
        options: [
          "Electric current",
          "Electric charge",
          "Magnetic field",
          "Electrical resistance",
        ],
        answer: "Electric charge",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the primary effect of increasing the current in a solenoid?",
        options: [
          "Decreases the magnetic field strength",
          "Increases the magnetic field strength",
          "No effect on magnetic field strength",
          "Changes the direction of the magnetic field",
        ],
        answer: "Increases the magnetic field strength",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What type of wave is light considered to be?",
        options: [
          "Mechanical wave",
          "Electromagnetic wave",
          "Longitudinal wave",
          "Transverse wave",
        ],
        answer: "Electromagnetic wave",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which device is used to measure electric current?",
        options: ["Voltmeter", "Ammeter", "Ohmmeter", "Galvanometer"],
        answer: "Ammeter",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What phenomenon occurs when a magnetic field changes in time, inducing an electric current?",
        options: ["Capacitance", "Induction", "Resistance", "Conduction"],
        answer: "Induction",
        difficulty: "Easy",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the force experienced by a charged particle moving through a magnetic field called?",
        options: [
          "Centripetal force",
          "Lorentz force",
          "Electrostatic force",
          "Gravitational force",
        ],
        answer: "Lorentz force",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the term for the region around a magnet where magnetic forces can be detected?",
        options: [
          "Electric field",
          "Magnetic field",
          "Electromagnetic field",
          "Gravitational field",
        ],
        answer: "Magnetic field",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "In which direction does the magnetic field lines point in relation to current in a straight conductor?",
        options: [
          "Inward towards the conductor",
          "Outward away from the conductor",
          "Perpendicular to the current",
          "Parallel to the current",
        ],
        answer: "Perpendicular to the current",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which of the following laws states that the induced electromotive force (emf) in any closed circuit is equal to the negative rate of change of magnetic flux through the circuit?",
        options: [
          "Faraday's Law of Induction",
          "Lenz's Law",
          "Ampere's Law",
          "Gauss's Law",
        ],
        answer: "Faraday's Law of Induction",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the principle of operation of a transformer based on?",
        options: [
          "Electrostatic induction",
          "Electromagnetic induction",
          "Conduction",
          "Capacitance",
        ],
        answer: "Electromagnetic induction",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What happens to the resistance of a conductor when its temperature increases?",
        options: [
          "Resistance decreases",
          "Resistance remains the same",
          "Resistance increases",
          "Resistance fluctuates",
        ],
        answer: "Resistance increases",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which of the following statements is true regarding alternating current (AC)?",
        options: [
          "It flows in one direction only.",
          "It can be easily transformed into different voltages.",
          "It is only used in batteries.",
          "It is less efficient than direct current (DC).",
        ],
        answer: "It can be easily transformed into different voltages.",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the effect of increasing the number of turns in a coil on its inductance?",
        options: [
          "Inductance decreases",
          "Inductance remains the same",
          "Inductance increases",
          "Inductance is not affected by the number of turns",
        ],
        answer: "Inductance increases",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What type of circuit includes resistors, capacitors, and inductors?",
        options: [
          "Resistive circuit",
          "AC circuit",
          "DC circuit",
          "RLC circuit",
        ],
        answer: "RLC circuit",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the formula for calculating the magnetic force on a current-carrying conductor in a magnetic field?",
        options: ["F = qE", "F = ILB sin θ", "F = mgh", "F = ma"],
        answer: "F = ILB sin θ",
        difficulty: "Medium",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What phenomenon explains the production of an electromotive force (emf) due to a change in magnetic flux through a circuit?",
        options: [
          "Electrostatic induction",
          "Faraday's law of electromagnetic induction",
          "Maxwell's equations",
          "Biot-Savart law",
        ],
        answer: "Faraday's law of electromagnetic induction",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "In electromagnetic waves, the electric field and magnetic field are:",
        options: [
          "Parallel to each other",
          "Perpendicular to each other and the direction of wave propagation",
          "In phase with each other",
          "Out of phase with each other",
        ],
        answer:
          "Perpendicular to each other and the direction of wave propagation",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which of the following laws describes the relationship between electric current and magnetic fields in terms of circular paths?",
        options: [
          "Ampère's Circuital Law",
          "Gauss's Law",
          "Faraday's Law",
          "Coulomb's Law",
        ],
        answer: "Ampère's Circuital Law",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the principle behind a moving coil galvanometer?",
        options: [
          "Magnetic force on a charged particle",
          "Electromagnetic induction",
          "Torque on a current loop in a magnetic field",
          "Electrostatic attraction",
        ],
        answer: "Torque on a current loop in a magnetic field",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the term for the point in a magnetic circuit where the total magnetic flux is zero?",
        options: [
          "Magnetic north",
          "Magnetic field intensity",
          "Magnetic saturation",
          "Magnetic neutral point",
        ],
        answer: "Magnetic neutral point",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "In a transformer, the ratio of primary to secondary voltage is equal to the ratio of:",
        options: [
          "The number of turns in the primary and secondary coils",
          "The capacitance in the primary and secondary circuits",
          "The inductance in the primary and secondary coils",
          "The power in the primary and secondary circuits",
        ],
        answer: "The number of turns in the primary and secondary coils",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Which phenomenon explains why a current-carrying wire experiences a force when placed in a magnetic field?",
        options: [
          "Electromagnetic induction",
          "Lorentz force",
          "Fleming's left-hand rule",
          "Fleming's right-hand rule",
        ],
        answer: "Lorentz force",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "What is the critical field strength of a superconductor known as?",
        options: [
          "Superconducting transition temperature",
          "Critical temperature",
          "Meissner effect",
          "Quantum critical point",
        ],
        answer: "Critical temperature",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "Maxwell's equations describe the behavior of electric and magnetic fields. Which equation represents the law of conservation of charge?",
        options: [
          "Gauss's law",
          "Faraday's law",
          "Ampère-Maxwell law",
          "Continuity equation",
        ],
        answer: "Continuity equation",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
      {
        text: "In the context of electromagnetic radiation, what is the significance of the speed of light in vacuum?",
        options: [
          "It varies with frequency",
          "It is constant and relates electric and magnetic fields",
          "It is inversely proportional to wavelength",
          "It determines the energy of photons",
        ],
        answer: "It is constant and relates electric and magnetic fields",
        difficulty: "Hard",
        topic: topicMap["Electromagnetism"],
      },
    ];
    await Mcq.insertMany(electromagnetismMcqQuestions);

    const organicChemistryMcqQuestions = [
      {
        text: "What is the simplest alkane?",
        options: ["Butane", "Ethane", "Methane", "Propane"],
        answer: "Methane",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which functional group is characterized by a carbon atom double-bonded to an oxygen atom?",
        options: ["Alcohol", "Aldehyde", "Ketone", "Carboxylic acid"],
        answer: "Ketone",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What type of bond is formed when two atoms share electrons?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Hydrogen bond",
          "Metallic bond",
        ],
        answer: "Covalent bond",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following is an example of a saturated hydrocarbon?",
        options: ["Ethene", "Ethane", "Acetylene", "Benzene"],
        answer: "Ethane",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the main functional group present in alcohols?",
        options: [
          "Aldehyde",
          "Hydroxyl group",
          "Carboxyl group",
          "Carbonyl group",
        ],
        answer: "Hydroxyl group",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following compounds is an aromatic hydrocarbon?",
        options: ["Hexane", "Cyclohexane", "Toluene", "Propylene"],
        answer: "Toluene",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What type of reaction involves the breaking of a bond and the addition of atoms to the resultant fragments?",
        options: [
          "Substitution reaction",
          "Elimination reaction",
          "Addition reaction",
          "Redox reaction",
        ],
        answer: "Addition reaction",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following compounds is a ketone?",
        options: ["Propanal", "Butan-2-one", "Butanoic acid", "Benzaldehyde"],
        answer: "Butan-2-one",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the product of the complete combustion of an alkane?",
        options: [
          "Carbon monoxide and water",
          "Carbon and water",
          "Carbon dioxide and water",
          "Alkenes and water",
        ],
        answer: "Carbon dioxide and water",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following is a property of organic compounds?",
        options: [
          "High melting points",
          "Soluble in water",
          "Conduct electricity in solution",
          "Flammable",
        ],
        answer: "Flammable",
        difficulty: "Easy",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following statements about isomers is true?",
        options: [
          "Isomers have the same molecular formula but different structures.",
          "Isomers have different molecular formulas.",
          "Isomers can only differ in the arrangement of atoms.",
          "Isomers cannot exist for the same compound.",
        ],
        answer:
          "Isomers have the same molecular formula but different structures.",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the process of converting an alkene into an alkane called?",
        options: [
          "Hydrogenation",
          "Dehydrogenation",
          "Halogenation",
          "Hydrolysis",
        ],
        answer: "Hydrogenation",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which reagent is commonly used to oxidize primary alcohols to aldehydes?",
        options: [
          "Sodium dichromate",
          "Hydrochloric acid",
          "Sodium bicarbonate",
          "Boric acid",
        ],
        answer: "Sodium dichromate",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the IUPAC name for the compound with the formula C4H10?",
        options: ["Butane", "Isobutane", "Butyne", "Butanol"],
        answer: "Butane",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What type of reaction occurs when an acid reacts with an alcohol?",
        options: [
          "Esterification",
          "Hydrolysis",
          "Dehydration",
          "Substitution",
        ],
        answer: "Esterification",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following compounds is a carboxylic acid?",
        options: ["Ethanol", "Acetic acid", "Benzaldehyde", "Hexane"],
        answer: "Acetic acid",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which reaction mechanism involves the formation of a carbocation intermediate?",
        options: [
          "Nucleophilic substitution",
          "Electrophilic addition",
          "Free radical substitution",
          "Elimination",
        ],
        answer: "Electrophilic addition",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the main feature that distinguishes aromatic compounds from aliphatic compounds?",
        options: [
          "Presence of a carbonyl group",
          "Saturation of carbon atoms",
          "Planar cyclic structure with delocalized π-electrons",
          "Presence of hydroxyl groups",
        ],
        answer: "Planar cyclic structure with delocalized π-electrons",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following is a characteristic reaction of alkenes?",
        options: [
          "Addition of water",
          "Formation of esters",
          "Substitution reactions",
          "Combustion",
        ],
        answer: "Addition of water",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What type of isomerism is exhibited by 1-butene and cis-2-butene?",
        options: [
          "Structural isomerism",
          "Geometric isomerism",
          "Optical isomerism",
          "Chain isomerism",
        ],
        answer: "Geometric isomerism",
        difficulty: "Medium",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the major product of the reaction between 1-butyne and HBr?",
        options: [
          "1-bromobutane",
          "2-bromobutane",
          "1,2-dibromobutane",
          "Butanol",
        ],
        answer: "2-bromobutane",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which reaction is used to convert an alcohol into a chloroalkane?",
        options: [
          "Williamson ether synthesis",
          "Lucas test",
          "Hydrohalogenation",
          "Conversion with thionyl chloride",
        ],
        answer: "Conversion with thionyl chloride",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What type of hybridization is present in the carbon atom of benzene?",
        options: ["sp", "sp²", "sp³", "sp³d"],
        answer: "sp²",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which of the following compounds can undergo electrophilic aromatic substitution most readily?",
        options: ["Benzene", "Toluene", "Chlorobenzene", "Nitrobenzene"],
        answer: "Toluene",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the product of the reaction of propan-1-ol with concentrated sulfuric acid at high temperatures?",
        options: ["Propene", "Ether", "Alkane", "Ester"],
        answer: "Propene",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which compound is known as a reducing agent in organic chemistry?",
        options: [
          "Potassium permanganate",
          "Sodium dichromate",
          "Lithium aluminum hydride",
          "Bromine",
        ],
        answer: "Lithium aluminum hydride",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the main mechanism of the hydrolysis of a primary alkyl halide?",
        options: ["SN1", "SN2", "E1", "E2"],
        answer: "SN2",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "In the context of organic reactions, what does the term 'stereochemistry' refer to?",
        options: [
          "The study of reaction rates",
          "The spatial arrangement of atoms in molecules",
          "The energy changes during reactions",
          "The mechanism of reaction",
        ],
        answer: "The spatial arrangement of atoms in molecules",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "Which compound undergoes aromatic substitution through a radical mechanism?",
        options: ["Benzene", "Toluene", "Phenol", "Chlorobenzene"],
        answer: "Toluene",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
      {
        text: "What is the role of a catalyst in a chemical reaction?",
        options: [
          "It increases the activation energy required.",
          "It decreases the rate of the reaction.",
          "It lowers the activation energy without being consumed.",
          "It changes the equilibrium of the reaction.",
        ],
        answer: "It lowers the activation energy without being consumed.",
        difficulty: "Hard",
        topic: topicMap["Organic Chemistry"],
      },
    ];
    await Mcq.insertMany(organicChemistryMcqQuestions);

    const chemicalBondingMcqQuestions = [
      {
        text: "Which of the following is an example of an ionic compound?",
        options: ["H₂O", "NaCl", "CO₂", "CH₄"],
        answer: "NaCl",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the main characteristic of a metallic bond?",
        options: [
          "Transfer of electrons",
          "Sharing of electrons",
          "Delocalized electrons",
          "Fixed positions of atoms",
        ],
        answer: "Delocalized electrons",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which of the following elements is most likely to form an ionic bond with chlorine?",
        options: ["Fluorine", "Oxygen", "Sodium", "Nitrogen"],
        answer: "Sodium",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of bond is present in a water molecule (H₂O)?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Metallic bond",
          "Van der Waals bond",
        ],
        answer: "Covalent bond",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "How many valence electrons does carbon have?",
        options: ["2", "4", "6", "8"],
        answer: "4",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which of the following statements is true about ionic compounds?",
        options: [
          "They have low melting points.",
          "They conduct electricity in solid form.",
          "They are formed by the transfer of electrons.",
          "They are usually gases at room temperature.",
        ],
        answer: "They are formed by the transfer of electrons.",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the bond angle in a methane (CH₄) molecule?",
        options: ["90 degrees", "109.5 degrees", "120 degrees", "180 degrees"],
        answer: "109.5 degrees",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which type of intermolecular force is the strongest?",
        options: [
          "Hydrogen bond",
          "Dipole-dipole interaction",
          "London dispersion force",
          "Van der Waals force",
        ],
        answer: "Hydrogen bond",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of bond exists between the two hydrogen atoms in H₂?",
        options: ["Ionic bond", "Covalent bond", "Metallic bond", "Polar bond"],
        answer: "Covalent bond",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which type of bond is typically formed between a metal and a non-metal?",
        options: [
          "Covalent bond",
          "Ionic bond",
          "Metallic bond",
          "Hydrogen bond",
        ],
        answer: "Ionic bond",
        difficulty: "Easy",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the primary factor that determines the shape of a molecule?",
        options: [
          "Molecular mass",
          "Electron geometry",
          "Intermolecular forces",
          "Number of atoms",
        ],
        answer: "Electron geometry",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which of the following molecules has a polar bond?",
        options: ["O₂", "N₂", "HCl", "CH₄"],
        answer: "HCl",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of hybridization is present in an ethylene (C₂H₄) molecule?",
        options: ["sp", "sp²", "sp³", "sp³d"],
        answer: "sp²",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which of the following best describes the bond length in a covalent bond?",
        options: [
          "The distance between the nuclei of two bonded atoms.",
          "The sum of the atomic radii of the two atoms.",
          "The average distance of the electrons from the nuclei.",
          "The energy required to break the bond.",
        ],
        answer: "The distance between the nuclei of two bonded atoms.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "In which of the following scenarios would you expect to find a dipole moment?",
        options: [
          "A nonpolar molecule with identical atoms.",
          "A symmetrical polar molecule.",
          "An asymmetrical molecule with different electronegativities.",
          "A molecule with no lone pairs on the central atom.",
        ],
        answer: "An asymmetrical molecule with different electronegativities.",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of bond forms between sodium and chlorine in sodium chloride (NaCl)?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Metallic bond",
          "Coordinate covalent bond",
        ],
        answer: "Ionic bond",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which of the following has the highest electronegativity?",
        options: ["Oxygen", "Carbon", "Fluorine", "Nitrogen"],
        answer: "Fluorine",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the primary characteristic of a covalent bond?",
        options: [
          "Transfer of electrons",
          "Sharing of electrons",
          "Metallic bonding",
          "Induction of dipoles",
        ],
        answer: "Sharing of electrons",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which intermolecular force is responsible for the unique properties of water?",
        options: [
          "Ionic interactions",
          "Hydrogen bonding",
          "Van der Waals forces",
          "Dipole-dipole interactions",
        ],
        answer: "Hydrogen bonding",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What determines the polarity of a molecule?",
        options: [
          "The number of hydrogen atoms",
          "The shape and bond dipoles",
          "The presence of lone pairs",
          "The total number of atoms",
        ],
        answer: "The shape and bond dipoles",
        difficulty: "Medium",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which theory explains the shapes of molecules based on electron repulsion?",
        options: [
          "VSEPR Theory",
          "Molecular Orbital Theory",
          "Valence Bond Theory",
          "Hybridization Theory",
        ],
        answer: "VSEPR Theory",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of bond forms when two atoms share electrons?",
        options: [
          "Ionic Bond",
          "Covalent Bond",
          "Metallic Bond",
          "Hydrogen Bond",
        ],
        answer: "Covalent Bond",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the geometry of a molecule with four bonding pairs and no lone pairs?",
        options: ["Linear", "Trigonal Planar", "Tetrahedral", "Octahedral"],
        answer: "Tetrahedral",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What type of hybridization is found in ethyne?",
        options: ["sp", "sp2", "sp3", "sp3d"],
        answer: "sp",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the main characteristic of ionic bonds?",
        options: [
          "Sharing of electrons",
          "Transfer of electrons",
          "Weak attraction",
          "Formation of molecules",
        ],
        answer: "Transfer of electrons",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which molecule is a common example of a nonpolar covalent bond?",
        options: ["Hydrochloric acid", "Oxygen", "Water", "Ammonia"],
        answer: "Oxygen",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which type of intermolecular force is present in liquid water?",
        options: [
          "London Dispersion Forces",
          "Dipole Dipole Interactions",
          "Hydrogen Bonds",
          "Ionic Bonds",
        ],
        answer: "Hydrogen Bonds",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What is the bond angle in a molecule with a trigonal planar shape?",
        options: ["90 degrees", "120 degrees", "180 degrees", "109.5 degrees"],
        answer: "120 degrees",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "Which hybridization is associated with the carbon atom in ethylene?",
        options: ["sp", "sp2", "sp3", "sp3d"],
        answer: "sp2",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
      {
        text: "What kind of bond is formed between atoms with a large difference in electronegativity?",
        options: [
          "Nonpolar Covalent Bond",
          "Polar Covalent Bond",
          "Ionic Bond",
          "Metallic Bond",
        ],
        answer: "Ionic Bond",
        difficulty: "Hard",
        topic: topicMap["Chemical Bonding"],
      },
    ];
    await Mcq.insertMany(chemicalBondingMcqQuestions);

    const consumerBehaviorMcqQuestions = [
      {
        text: "What is consumer behavior?",
        options: [
          "The study of how individuals make decisions to spend their resources",
          "The process of manufacturing goods",
          "The management of sales teams",
          "The advertising strategies of companies",
        ],
        answer:
          "The study of how individuals make decisions to spend their resources",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which of the following factors influences consumer behavior?",
        options: [
          "Cultural factors",
          "Personal factors",
          "Social factors",
          "All of the above",
        ],
        answer: "All of the above",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the buying decision process?",
        options: [
          "Need recognition, information search, evaluation of alternatives, purchase decision, post-purchase behavior",
          "Market segmentation, targeting, positioning",
          "Product development, pricing, promotion",
          "None of the above",
        ],
        answer:
          "Need recognition, information search, evaluation of alternatives, purchase decision, post-purchase behavior",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is brand loyalty?",
        options: [
          "A consumer's commitment to repurchase or continue using a brand",
          "The variety of products offered by a brand",
          "The price sensitivity of consumers",
          "The effectiveness of advertising",
        ],
        answer:
          "A consumer's commitment to repurchase or continue using a brand",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which of the following is a psychological factor affecting consumer behavior?",
        options: ["Motivation", "Family", "Culture", "Social status"],
        answer: "Motivation",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role does advertising play in consumer behavior?",
        options: [
          "It informs consumers about products",
          "It creates a desire for products",
          "It differentiates products from competitors",
          "All of the above",
        ],
        answer: "All of the above",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the term for the emotional response a consumer has to a brand?",
        options: [
          "Brand equity",
          "Brand image",
          "Brand awareness",
          "Brand loyalty",
        ],
        answer: "Brand image",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What does 'perception' mean in the context of consumer behavior?",
        options: [
          "The process by which consumers select, organize, and interpret information",
          "The decision to purchase a product",
          "The analysis of product features",
          "The comparison of prices",
        ],
        answer:
          "The process by which consumers select, organize, and interpret information",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which stage of the buying decision process involves comparing different products?",
        options: [
          "Need recognition",
          "Information search",
          "Evaluation of alternatives",
          "Post-purchase behavior",
        ],
        answer: "Evaluation of alternatives",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the main focus of consumer behavior studies?",
        options: [
          "Understanding consumer preferences and buying habits",
          "Maximizing profits for companies",
          "Improving product quality",
          "Increasing market share",
        ],
        answer: "Understanding consumer preferences and buying habits",
        difficulty: "Easy",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which type of consumer decision-making involves a high level of involvement?",
        options: [
          "Routine response behavior",
          "Limited decision making",
          "Extended decision making",
          "Impulse buying",
        ],
        answer: "Extended decision making",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the 'post-purchase dissonance'?",
        options: [
          "A feeling of regret after making a purchase",
          "The satisfaction derived from a product",
          "The desire to buy more products",
          "The awareness of brand choices",
        ],
        answer: "A feeling of regret after making a purchase",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the significance of 'reference groups' in consumer behavior?",
        options: [
          "They influence consumer preferences and behaviors",
          "They have no effect on purchasing decisions",
          "They only affect brand awareness",
          "They are irrelevant in marketing",
        ],
        answer: "They influence consumer preferences and behaviors",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How do cultural factors affect consumer behavior?",
        options: [
          "They determine the quality of products",
          "They shape values, perceptions, preferences, and behaviors",
          "They only impact pricing strategies",
          "They do not influence buying decisions",
        ],
        answer: "They shape values, perceptions, preferences, and behaviors",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which psychological concept refers to the internal drive to satisfy needs?",
        options: ["Perception", "Learning", "Motivation", "Attitude"],
        answer: "Motivation",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What does 'market segmentation' refer to?",
        options: [
          "Dividing a market into distinct groups of buyers",
          "Analyzing consumer preferences",
          "Identifying new product opportunities",
          "Determining pricing strategies",
        ],
        answer: "Dividing a market into distinct groups of buyers",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which of the following is an example of an external factor affecting consumer behavior?",
        options: [
          "Personal values",
          "Social class",
          "Personality",
          "Motivation",
        ],
        answer: "Social class",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role do emotions play in consumer behavior?",
        options: [
          "They have no impact on decision making",
          "They solely influence brand loyalty",
          "They can affect purchasing decisions and satisfaction",
          "They only matter in advertising",
        ],
        answer: "They can affect purchasing decisions and satisfaction",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the primary goal of marketing research in relation to consumer behavior?",
        options: [
          "To analyze competitors",
          "To understand consumer preferences and trends",
          "To improve sales strategies",
          "To develop new products",
        ],
        answer: "To understand consumer preferences and trends",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which concept describes how consumers perceive the quality of a product based on its price?",
        options: [
          "Price-quality relationship",
          "Brand equity",
          "Consumer trust",
          "Market demand",
        ],
        answer: "Price-quality relationship",
        difficulty: "Medium",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the primary purpose of using behavioral targeting in digital marketing?",
        options: [
          "To reduce advertising costs",
          "To enhance consumer engagement based on past behavior",
          "To identify new market segments",
          "To measure advertising effectiveness",
        ],
        answer: "To enhance consumer engagement based on past behavior",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which psychological theory explains how consumers learn from their experiences?",
        options: [
          "Cognitive Dissonance Theory",
          "Classical Conditioning Theory",
          "Operant Conditioning Theory",
          "Social Learning Theory",
        ],
        answer: "Operant Conditioning Theory",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the term used to describe the process by which consumers develop attitudes towards brands?",
        options: [
          "Brand positioning",
          "Brand loyalty",
          "Attitude formation",
          "Brand equity",
        ],
        answer: "Attitude formation",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "Which of the following best describes the concept of 'affective forecasting' in consumer behavior?",
        options: [
          "Predicting future consumer choices based on past trends",
          "Estimating future emotional reactions to products or experiences",
          "Analyzing market conditions to forecast demand",
          "Evaluating the effectiveness of marketing campaigns",
        ],
        answer:
          "Estimating future emotional reactions to products or experiences",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the main difference between intrinsic and extrinsic motivation in consumer behavior?",
        options: [
          "Intrinsic motivation is driven by external rewards; extrinsic is driven by internal satisfaction",
          "Intrinsic motivation is influenced by personal values; extrinsic is influenced by external factors",
          "Intrinsic motivation focuses on brand loyalty; extrinsic focuses on price sensitivity",
          "Intrinsic motivation leads to habitual purchases; extrinsic leads to impulse buys",
        ],
        answer:
          "Intrinsic motivation is influenced by personal values; extrinsic is influenced by external factors",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "How does the concept of 'cognitive dissonance' relate to post-purchase behavior?",
        options: [
          "It refers to the satisfaction a consumer feels after a purchase",
          "It describes the discomfort felt when holding conflicting beliefs about a product after purchase",
          "It is the method of evaluating product alternatives",
          "It explains the tendency to seek information before purchasing",
        ],
        answer:
          "It describes the discomfort felt when holding conflicting beliefs about a product after purchase",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the significance of 'brand equity' in consumer behavior?",
        options: [
          "It measures the physical assets of a brand",
          "It reflects the value added to a product by having a well-known brand name",
          "It describes the market share of a brand",
          "It indicates the price sensitivity of consumers",
        ],
        answer:
          "It reflects the value added to a product by having a well-known brand name",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "In which way do social media influencers primarily impact consumer behavior?",
        options: [
          "By providing discounts to consumers",
          "By shaping perceptions and creating brand awareness",
          "By replacing traditional advertising methods",
          "By increasing product prices",
        ],
        answer: "By shaping perceptions and creating brand awareness",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What role does 'social proof' play in influencing consumer behavior?",
        options: [
          "It validates a consumer's purchasing decision through others' experiences",
          "It guarantees product quality",
          "It enhances brand loyalty",
          "It reduces cognitive dissonance",
        ],
        answer:
          "It validates a consumer's purchasing decision through others' experiences",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
      {
        text: "What is the impact of 'choice overload' on consumer behavior?",
        options: [
          "It simplifies decision-making for consumers",
          "It leads to increased satisfaction with choices",
          "It can result in decision paralysis and dissatisfaction",
          "It encourages consumers to make impulsive purchases",
        ],
        answer: "It can result in decision paralysis and dissatisfaction",
        difficulty: "Hard",
        topic: topicMap["Consumer Behavior"],
      },
    ];
    await Mcq.insertMany(consumerBehaviorMcqQuestions);

    const brandMangementMcqQuestions = [
      {
        text: "What is the primary purpose of brand management?",
        options: [
          "To develop new products",
          "To increase brand awareness and loyalty",
          "To reduce advertising costs",
          "To manage supply chains",
        ],
        answer: "To increase brand awareness and loyalty",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following is a key component of brand equity?",
        options: [
          "Customer satisfaction",
          "Product variety",
          "Distribution channels",
          "Production costs",
        ],
        answer: "Customer satisfaction",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What does 'brand positioning' refer to?",
        options: [
          "The price of a brand compared to competitors",
          "How a brand is perceived in the minds of consumers",
          "The variety of products offered under a brand",
          "The advertising strategies used for a brand",
        ],
        answer: "How a brand is perceived in the minds of consumers",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which term describes the visual elements that represent a brand?",
        options: [
          "Brand personality",
          "Brand identity",
          "Brand equity",
          "Brand strategy",
        ],
        answer: "Brand identity",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a brand ambassador?",
        options: [
          "A person who creates advertisements for a brand",
          "An individual who promotes a brand to increase awareness",
          "A customer who dislikes a brand",
          "A brand that sells luxury products",
        ],
        answer: "An individual who promotes a brand to increase awareness",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following is a benefit of strong brand loyalty?",
        options: [
          "Increased market competition",
          "Higher customer retention",
          "Lower advertising expenses",
          "Decreased product variety",
        ],
        answer: "Higher customer retention",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the role of a brand's mission statement?",
        options: [
          "To outline the company's financial goals",
          "To define the brand's purpose and values",
          "To describe the brand's product offerings",
          "To provide advertising strategies",
        ],
        answer: "To define the brand's purpose and values",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What does 'brand differentiation' help achieve?",
        options: [
          "Lower production costs",
          "Unique market positioning",
          "Increased competition",
          "Higher product prices",
        ],
        answer: "Unique market positioning",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following is an example of brand extension?",
        options: [
          "A company introducing a new flavor of its existing snack",
          "A clothing brand launching a new line of shoes",
          "A brand changing its logo",
          "A brand using a celebrity for advertising",
        ],
        answer: "A clothing brand launching a new line of shoes",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the impact of consistent branding across all platforms?",
        options: [
          "It confuses customers",
          "It builds trust and recognition",
          "It decreases sales",
          "It complicates marketing strategies",
        ],
        answer: "It builds trust and recognition",
        difficulty: "Easy",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a brand's value proposition?",
        options: [
          "The price of the brand's products",
          "The unique benefits offered by the brand to consumers",
          "The geographical market served by the brand",
          "The advertising budget of the brand",
        ],
        answer: "The unique benefits offered by the brand to consumers",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following best describes brand loyalty?",
        options: [
          "The tendency to buy the same brand repeatedly",
          "The willingness to try new brands",
          "The belief that all brands are the same",
          "The interest in brand advertisements",
        ],
        answer: "The tendency to buy the same brand repeatedly",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can a brand measure its equity?",
        options: [
          "By calculating total sales",
          "Through customer feedback and brand perception studies",
          "By analyzing market share alone",
          "By reviewing production costs",
        ],
        answer: "Through customer feedback and brand perception studies",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the purpose of a brand audit?",
        options: [
          "To evaluate the financial performance of a brand",
          "To assess the brand’s current position in the market and its effectiveness",
          "To identify new product opportunities",
          "To determine the manufacturing process of products",
        ],
        answer:
          "To assess the brand’s current position in the market and its effectiveness",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which strategy involves creating a new brand for a new product line?",
        options: [
          "Brand extension",
          "Line extension",
          "Multi-brand strategy",
          "Co-branding",
        ],
        answer: "Multi-brand strategy",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the main goal of rebranding?",
        options: [
          "To maintain the existing customer base",
          "To refresh the brand's image and attract new customers",
          "To increase the production capacity",
          "To lower the brand's price",
        ],
        answer: "To refresh the brand's image and attract new customers",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How does effective storytelling enhance brand management?",
        options: [
          "By creating complicated narratives",
          "By confusing the audience",
          "By building emotional connections with consumers",
          "By reducing the need for advertising",
        ],
        answer: "By building emotional connections with consumers",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is a common consequence of poor brand management?",
        options: [
          "Increased customer loyalty",
          "Positive brand associations",
          "Loss of market share",
          "Higher product demand",
        ],
        answer: "Loss of market share",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the role of competitive analysis in brand management?",
        options: [
          "To define the product features of competitors",
          "To understand market dynamics and improve brand positioning",
          "To determine pricing strategies for competitors",
          "To reduce advertising costs",
        ],
        answer: "To understand market dynamics and improve brand positioning",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following elements is crucial for maintaining brand consistency?",
        options: [
          "Using a variety of logos",
          "Consistent messaging across all marketing channels",
          "Changing the brand colors frequently",
          "Varying the target audience",
        ],
        answer: "Consistent messaging across all marketing channels",
        difficulty: "Medium",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which framework is commonly used to analyze brand equity?",
        options: [
          "SWOT Analysis",
          "Porter's Five Forces",
          "Keller's Brand Equity Model",
          "PEST Analysis",
        ],
        answer: "Keller's Brand Equity Model",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the primary challenge of global brand management?",
        options: [
          "Maintaining brand consistency across different markets",
          "Increasing production capacity",
          "Managing local supply chains",
          "Reducing marketing costs",
        ],
        answer: "Maintaining brand consistency across different markets",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "In brand architecture, what does a 'house of brands' refer to?",
        options: [
          "A single brand offering multiple product lines",
          "A collection of related products under one brand name",
          "Multiple distinct brands owned by a single parent company",
          "A brand that focuses solely on luxury products",
        ],
        answer: "Multiple distinct brands owned by a single parent company",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which of the following is a strategic approach for managing brand crises?",
        options: [
          "Denying the issue",
          "Transparent communication and quick response",
          "Ignoring customer feedback",
          "Changing the brand name",
        ],
        answer: "Transparent communication and quick response",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What does 'brand dilution' refer to?",
        options: [
          "The enhancement of brand value through strategic partnerships",
          "The weakening of a brand's equity due to overextension or poor marketing",
          "The increase in brand loyalty over time",
          "The consistent growth of market share",
        ],
        answer:
          "The weakening of a brand's equity due to overextension or poor marketing",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "Which metric is most effective for measuring customer lifetime value (CLV)?",
        options: [
          "Average purchase value multiplied by purchase frequency",
          "Total sales divided by total customers",
          "Market share percentage",
          "Total advertising costs",
        ],
        answer: "Average purchase value multiplied by purchase frequency",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the significance of the Brand Z metric?",
        options: [
          "It measures brand awareness only",
          "It assesses brand equity based on consumer perceptions and financial performance",
          "It focuses solely on social media presence",
          "It evaluates production efficiency",
        ],
        answer:
          "It assesses brand equity based on consumer perceptions and financial performance",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "How can a brand effectively utilize neuromarketing?",
        options: [
          "By focusing on traditional marketing techniques",
          "By understanding consumer emotional responses to advertisements",
          "By reducing advertising budgets",
          "By increasing product prices",
        ],
        answer:
          "By understanding consumer emotional responses to advertisements",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What does the term 'brand resonance' refer to?",
        options: [
          "The immediate recognition of a brand",
          "The strong emotional connection and loyalty consumers have towards a brand",
          "The financial performance of a brand",
          "The variety of products offered under a brand",
        ],
        answer:
          "The strong emotional connection and loyalty consumers have towards a brand",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
      {
        text: "What is the role of sensory branding?",
        options: [
          "To improve operational efficiency",
          "To enhance consumer experiences through multiple senses",
          "To reduce marketing expenditures",
          "To focus solely on visual branding elements",
        ],
        answer: "To enhance consumer experiences through multiple senses",
        difficulty: "Hard",
        topic: topicMap["Brand Management"],
      },
    ];
    await Mcq.insertMany(brandMangementMcqQuestions);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

module.exports = seedDatabase;
