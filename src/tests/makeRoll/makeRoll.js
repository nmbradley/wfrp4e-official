const makeRoll = (roll, target, advantage = false, difficulty = false) => {
    const roll_array = [];
    const full_target = [
        `@{${target}}`,
        `+@{difficulty_query}`,
        `+@{roll_query}`
    ].join("");
    const advantage_target = [
        `@{${target}}`,
        `+@{difficulty_query}`,
        `+@{roll_query}`,
        `+(@{advantage}*10)`
    ].join("");

    roll_array.push(`@{roll_whisper}`);
    roll_array.push(`&{template:wfrp}`);
    roll_array.push(`{{name=@{character_name}}}`);

    if (target) {
        roll_array.push(`{{roll=[[1d100cs<@{roll_cs}cf>@{roll_cf}]]}}`);

        if (difficulty === "combat") roll_array.push(`{{difficulty=[[@{difficulty_query_combat}]]}}`);
        else roll_array.push(`{{difficulty=[[@{difficulty_query}]]}}`);

        roll_array.push(`{{bonus=[[@{roll_query}]]}}`);
        roll_array.push(`@{roll_slbonus}`);
    }
    if (target && !advantage) {
        roll_array.push(`{{target=[[${full_target}]]}}`);
    } else if (target && advantage) {
        roll_array.push(`{{target=[[${advantage_target}]]}}`);
        roll_array.push(`{{roll_advantage=[[(@{advantage}*10)]]}}`);
    }

    Object.entries(roll).forEach(([key, val]) => roll_array.push(`{{${key}=${val}}}`));

    return roll_array.join(" ");
}

const constructRoll = (props) => {
    // Throw error if no props.
    if (!props) throw new Error("No props provided to constructRoll");

    // Destructure props
    const { name, type, notes = "", attr, advantage = false, category, children } = props;

    // Find any missing fields
    const missing_fields = [];

    if (!name) missing_fields.push("name")
    if (!type) missing_fields.push("type")
    if (!category) missing_fields.push("category")

    // Reject if fields are missing
    if (missing_fields.length > 0) throw new Error(`Missing ${missing_fields.join(", ")} from parameters.`)

    // Define some useful variables
    const difficulty = (category === "combat" || category === "magic") ? `{{difficulty=[[@{difficulty_query_combat}]]}}` :
        `{{difficulty=[[@{difficulty_query}]]}}`;

    const full_target = [
        `@{${attr}}`,
        `+@{difficulty_query}`,
        `+@{roll_query}`
    ].join("");

    const advantage_target = [
        `@{${attr}}`,
        `+@{difficulty_query}`,
        `+@{roll_query}`,
        `+(@{advantage}*10)`
    ].join("");

    const target = `{{target=[[${(advantage) ? advantage_target : full_target}]]}}`;

    // Init the roll array, set default elements
    let roll = [
        `@{roll_whisper}`,
        `&{template:wfrp}`,
        `{{name=@{character_name}}}`,
        `{{roll_type=${type}}}`,
        `{{roll_name=${name}}}`
    ];

    if (attr) {
        roll.push(`{{roll=[[1d100cs<@{roll_cs}cf>@{roll_cf}]]}}`);
        roll.push(`{{bonus=[[@{roll_query}]]}}`);
        roll.push(`@{roll_slbonus}`);
        roll.push(difficulty);
        roll.push(target);
        if (advantage) roll.push("{{roll_advantage=[[(@{advantage}*10)]]}}");
    }

    // Add all remaining children to the roll
    Object.entries(children).forEach(([key, val]) => roll.push(`{{roll_${key}=${val}}}`));

    // Return the roll array as a joined string
    return roll.join(" ");
}