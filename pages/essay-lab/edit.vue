<template>
  <div class="essay__edit-page">
    <PageBanner />
    <div class="essay__grid">
      <div class="essay__left">
        <h4 class="essay__title">
          School students should be allowed to curate their high school
          curriculum.
        </h4>
        <div class="essay__text">
          <p>
            The question of whether animals should be used for experiments and
            research has long been debated among scientists, ethicists, and the
            general public. While research on animals has contributed to many
            medical and technological advancements, it raises serious ethical
            concerns. In particular, the use of certain types of animals—such as
            primates, dogs, cats, and other sentient beings—should be considered
            illegal. These animals are highly intelligent, capable of feeling
            pain, and often suffer tremendously during experiments. Therefore,
            continuing to exploit them for research purposes cannot be justified
            from either a moral or a scientific perspective.
          </p>
          <p>
            First, using animals that possess advanced cognitive abilities and
            strong emotional capacities violates basic ethical principles. For
            instance, primates share up to 98% of their DNA with humans and
            exhibit complex behaviors such as problem-solving, communication,
            and social bonding. Subjecting them to painful procedures,
            isolation, or toxic testing is not only cruel but also morally
            inconsistent. Similarly, domesticated animals like dogs and cats are
            considered companions in most cultures, which makes their use in
            laboratories a contradiction to the values of compassion and respect
            that society claims to uphold. If we agree that these animals
            deserve protection in our homes, they should also be protected from
            harm in research institutions.
          </p>
          <p>
            Second, scientific advancements have provided alternatives that make
            animal testing less necessary. Technologies such as computer
            modeling, artificial intelligence, organ-on-a-chip systems, and
            advanced cell cultures can replicate human biology more accurately
            than animal models in many cases. For example, toxicity testing and
            drug development can now be performed on human cell lines or virtual
            simulations, which reduces the reliance on animal experiments.
            Investing in these alternatives not only prevents animal suffering
            but also enhances the quality of scientific results, since
            human-based models are more relevant to human health outcomes than
            animal ones.
          </p>
          <p>
            Moreover, the effectiveness of animal testing is increasingly being
            questioned. Many drugs and treatments that appear successful in
            animals fail during human trials due to biological differences.
            Statistics show that a large percentage of medicines tested on
            animals do not pass human clinical trials, meaning that much of the
            suffering inflicted on animals does not even contribute directly to
            human benefits. This inefficiency further supports the argument that
            experimenting on sentient animals is not only unethical but also
            scientifically unreliable.
          </p>
          <p>
            Critics may argue that animal testing is necessary to protect human
            lives and to advance medical science. While it is true that animal
            experiments in the past have led to breakthroughs such as vaccines
            and treatments, it is also true that society evolves and finds
            better methods over time. Just as we no longer accept unethical
            practices like experimenting on humans without consent, we should
            also progress beyond exploiting animals that experience pain, fear,
            and distress. The ultimate goal of science should be to promote life
            and well-being without causing unnecessary harm.
          </p>
          <p>
            In conclusion, it should be illegal to use certain types of animals
            for experiments and other research purposes. The moral
            responsibility we carry towards sentient beings, combined with the
            availability of modern alternatives, makes such practices both
            outdated and inhumane. By outlawing experiments on intelligent and
            emotionally complex animals, society would not only reduce suffering
            but also encourage innovation in more ethical and effective research
            methods. Protecting these animals is not just a matter of
            compassion; it is a step toward creating a more responsible and
            humane scientific community.
          </p>
        </div>
      </div>
      <div class="essay__right">
        <div>
          <div class="right__head">
            <h4 class="section__title">Teacher</h4>
            <button class="edit">
              <Icon name="lucide:ellipsis-vertical" class="icon" />
            </button>
          </div>
          <div>
            <div class="essay__info">
              <div class="essay__img">
                <NuxtImg src="/images/person.jpg" alt="Person" />
              </div>
              <div>
                <p class="essay__name">Yu Jimin</p>
                <p class="essay__status green">Sent</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="right__head">
            <h4 class="section__title">Feedbacks</h4>
            <p class="right__count">Total: 46</p>
          </div>
          <div class="feedback__items">
            <div class="feedback__item">
              <p>#1 <Icon name="lucide:dot" class="icon" /> 14:50</p>
              <a href="#"> https://google.docs/13123Hgwe!#@VPwoe </a>
            </div>
            <div class="feedback__item">
              <p>#2 <Icon name="lucide:dot" class="icon" /> 14:50</p>
              <a href="#"> https://google.docs/13123Hgwe!#@VPwoe </a>
            </div>
            <div class="feedback__item">
              <p>#3 <Icon name="lucide:dot" class="icon" /> 14:50</p>
              <a href="#"> https://google.docs/13123Hgwe!#@VPwoe </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay__edit-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.essay__grid {
  display: grid;
  grid-template-columns: 1fr 384px;
  gap: 24px;
}
.essay__left {
  background: white;
  padding: 24px;
  border-radius: 16px;
  margin-top: 16px;
}
.essay__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  margin: 8px 0 16px 0;
}
.essay__text {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--essay-txt);
}
.essay__right {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  height: fit-content;
}
.right__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.right__count {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-grey);
}
.essay__info {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 24px;
}
.essay__img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.essay__name {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.essay__status {
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}

.feedback__items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.feedback__item p {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-grey);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.feedback__item a {
  font-size: 14px;
  line-height: 20px;
  color: var(--blue);
  word-break: break-all;
}
</style>
