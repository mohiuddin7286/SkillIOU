package com.skilliou.backend.config;

import com.skilliou.backend.model.User;
import com.skilliou.backend.model.Skill;
import com.skilliou.backend.model.Ledger;
import com.skilliou.backend.repository.UserRepository;
import com.skilliou.backend.repository.SkillRepository;
import com.skilliou.backend.repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private LedgerRepository ledgerRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create test users
        User odin = new User();
        odin.setName("Odin");
        odin.setEmail("odin@test.com");
        odin.setPhone("1234567890");
        odin.setTrustScore(100);
        userRepository.save(odin);

        User shrey = new User();
        shrey.setName("Shrey");
        shrey.setEmail("shrey@test.com");
        shrey.setPhone("0987654321");
        shrey.setTrustScore(95);
        userRepository.save(shrey);

        User alice = new User();
        alice.setName("Alice Johnson");
        alice.setEmail("alice@test.com");
        alice.setPhone("5551234567");
        alice.setTrustScore(85);
        userRepository.save(alice);

        User bob = new User();
        bob.setName("Bob Williams");
        bob.setEmail("bob@test.com");
        bob.setPhone("5559876543");
        bob.setTrustScore(90);
        userRepository.save(bob);

        // Create test skills
        Skill java = new Skill();
        java.setName("Java Programming");
        java.setCategory("Programming");
        skillRepository.save(java);

        Skill python = new Skill();
        python.setName("Python");
        python.setCategory("Programming");
        skillRepository.save(python);

        Skill cooking = new Skill();
        cooking.setName("Cooking");
        cooking.setCategory("Lifestyle");
        skillRepository.save(cooking);

        Skill guitar = new Skill();
        guitar.setName("Guitar");
        guitar.setCategory("Music");
        skillRepository.save(guitar);

        Skill design = new Skill();
        design.setName("Graphic Design");
        design.setCategory("Creative");
        skillRepository.save(design);

        // Create test ledger entries
        Ledger ledger1 = new Ledger();
        ledger1.setUser(odin);
        ledger1.setReason("Initial Balance");
        ledger1.setCreditChange(100.0);
        ledgerRepository.save(ledger1);

        Ledger ledger2 = new Ledger();
        ledger2.setUser(shrey);
        ledger2.setReason("Helped a neighbor");
        ledger2.setCreditChange(50.0);
        ledgerRepository.save(ledger2);
    }
}
