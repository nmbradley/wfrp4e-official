let roll = {};
let parameters = {
    a: {
        name: `Accounting`,
        type: `Skill`,
        attr: "accounting",
        advantage: true,
        category: "skill",
        children: {
            notes: `Testing to ensure notes are collected`,
        }
    },
    b: {
        name: `Longsword`,
        type: `Basic Attack`,
        attr: "weapon_attack",
        advantage: true,
        category: "combat",
        children: {
            target: "one creature",
            range: "Close",
            text: `Attack description`,
            damage: `7 + Opposed SL`,
            hit_location: "1",
            crit_location: "[[1d100]]",
        }
    },
    c: {
        name: `Sixth Sense`,
        type: `Trait`,
        category: "trait",
        children: {
            text: `The trait description is here.`,
        }
    },
    d: {
        name: `Dart`,
        type: `Spell`,
        attr: `spell_total`,
        advantage: true,
        category: `magic`,
        children: {
            target: "1 person",
            duration: "3 days",
            range: "10 yards",
            cn: "10",
            text: "A dart of energy strikes the target.",
        }
    }
};

QUnit.module("constructRoll tests", hooks => {

    QUnit.test("Ensure that the new function produces the same basic result as the first.", assert => {

        // Declare values object
        const values = {
            roll_name: parameters.a.name,
            roll_type: parameters.a.type,
            roll_notes: parameters.a.children.notes,
        }

        // Run the two functions with the same data.
        const result_a = makeRoll(values, parameters.a.attr, parameters.a.advantage, parameters.a.category).split("} ");
        const result_b = constructRoll(parameters.a).split("} ");

        // Run the test
        for (const match of result_b) {
            const is_match = (!result_a.indexOf(match) > -1);

            assert.ok(is_match, `${match} found in new`)
        }
    });

    QUnit.test("Ensure that the new function returns a string", assert => {

        // Collect results
        const result_a = constructRoll(parameters.a);

        // Run the test
        assert.equal(typeof result_a, "string", "It returns a string.");
    });

    QUnit.test("Ensure that the new function throws an error with no props, or missing props", assert => {

        // Create malformed data
        const missing_name = {...parameters.a };
        const missing_type = {...parameters.a };
        const missing_attr = {...parameters.a };
        const missing_category = {...parameters.a };

        delete missing_name.name;
        delete missing_type.type;
        delete missing_attr.attr;
        delete missing_category.category;

        // Run tests
        assert.throws(() => constructRoll(), new Error("No props provided to constructRoll"), "Throws error for no props");
        assert.throws(() => constructRoll(missing_name), /name/g, "No name provided to constructRoll");
        assert.throws(() => constructRoll(missing_type), /type/g, "No type provided to constructRoll");
        assert.throws(() => constructRoll(missing_category), /category/g, "No category provided to constructRoll");
    });

    QUnit.test("Ensure that constructRoll correctly handles basic skill rolls", assert => {

        // Collect results 
        const result_a = constructRoll(parameters.a);

        // List matches
        const matches = [
            `@{roll_whisper}`,
            `&{template:wfrp}`,
            `{{name=@{character_name}}}`,
            `{{roll=[[1d100cs<@{roll_cs}cf>@{roll_cf}]]}}`,
            `{{difficulty=[[@{difficulty_query}]]}}`,
            `{{bonus=[[@{roll_query}]]}}`,
            `@{roll_slbonus}`,
            `{{target=[[@{accounting}+@{difficulty_query}+@{roll_query}+(@{advantage}*10)]]}}`,
            `{{roll_advantage=[[(@{advantage}*10)]]}}`,
            `{{roll_name=${parameters.a.name}}}`,
            `{{roll_type=${parameters.a.type}}}`,
            `{{roll_notes=${parameters.a.children.notes}}}`,
        ];

        // Loop through matches, verify content
        for (match of matches) {
            const is_match = result_a.indexOf(match) > -1;

            assert.ok(is_match, `${match} was in generated string`);
        }
    });

    QUnit.test("Ensure that constructRoll correctly handles weapon rolls", assert => {

        // Collect results
        const result_b = constructRoll(parameters.b);

        // List matches
        const matches = [
            `@{roll_whisper}`,
            `&{template:wfrp}`,
            `{{name=@{character_name}}}`,
            `{{roll=[[1d100cs<@{roll_cs}cf>@{roll_cf}]]}}`,
            `{{difficulty=[[@{difficulty_query_combat}]]}}`,
            `{{bonus=[[@{roll_query}]]}}`,
            `@{roll_slbonus}`,
            `{{target=[[@{weapon_attack}+@{difficulty_query}+@{roll_query}+(@{advantage}*10)]]}}`,
            `{{roll_advantage=[[(@{advantage}*10)]]}}`,
            `{{roll_name=${parameters.b.name}}}`,
            `{{roll_type=${parameters.b.type}}}`,
            `{{roll_target=${parameters.b.children.target}}}`,
            `{{roll_range=${parameters.b.children.range}}}`,
            `{{roll_text=${parameters.b.children.text}}}`,
            `{{roll_damage=${parameters.b.children.damage}}}`,
            `{{roll_hit_location=${parameters.b.children.hit_location}}}`,
            `{{roll_crit_location=${parameters.b.children.crit_location}}}`,
        ];

        // Loop through matches, verify content
        for (match of matches) {
            const is_match = result_b.indexOf(match) > -1;

            assert.ok(is_match, `${match} was in generated string`);
        }

    })

    QUnit.test("Ensure that constructRoll correctly handles vocalise rolls", assert => {

        // Collect results
        const result_c = constructRoll(parameters.c);

        // List matches
        const matches = [
            `@{roll_whisper}`,
            `&{template:wfrp}`,
            `{{name=@{character_name}}}`,
            `{{roll_name=${parameters.c.name}}}`,
            `{{roll_type=${parameters.c.type}}}`,
            `{{roll_text=${parameters.c.children.text}}}`,
        ];

        // Loop through matches, verify content
        for (match of matches) {
            const is_match = result_c.indexOf(match) > -1;

            assert.ok(is_match, `${match} was in generated string`);
        }

    })

    QUnit.test("Ensure that constructRoll correctly handles magic rolls", assert => {

        // Collect results
        const result_d = constructRoll(parameters.d);

        // List matches
        const matches = [
            `@{roll_whisper}`,
            `&{template:wfrp}`,
            `{{name=@{character_name}}}`,
            `{{roll=[[1d100cs<@{roll_cs}cf>@{roll_cf}]]}}`,
            `{{difficulty=[[@{difficulty_query_combat}]]}}`,
            `{{bonus=[[@{roll_query}]]}}`,
            `@{roll_slbonus}`,
            `{{target=[[@{spell_total}+@{difficulty_query}+@{roll_query}+(@{advantage}*10)]]}}`,
            `{{roll_advantage=[[(@{advantage}*10)]]}}`,
            `{{roll_name=${parameters.d.name}}}`,
            `{{roll_type=${parameters.d.type}}}`,
            `{{roll_target=${parameters.d.children.target}}}`,
            `{{roll_duration=${parameters.d.children.duration}}}`,
            `{{roll_range=${parameters.d.children.range}}}`,
            `{{roll_cn=${parameters.d.children.cn}}}`,
            `{{roll_text=${parameters.d.children.text}}}`,
        ];

        // Loop through matches, verify content
        for (match of matches) {
            const is_match = result_d.indexOf(match) > -1;

            assert.ok(is_match, `${match} was in generated string`);
        }
    });

});