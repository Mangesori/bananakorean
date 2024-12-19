"use client";
import React from "react";
import Link from "next/link";

const GrammarTopicSelection = () => {
  const grammarTopics = [
    {
      title: "은/는, 이에요/예요",
      description: "Topic markers 은/는 and copula 이에요/예요.",
      path: "/quiz/solve?type=grammar&topic=은/는-이에요/예요",
    },
    {
      title: "이/가 아니에요",
      description: "Negative form 이/가 아니에요.",
      path: "/quiz/solve?type=grammar&topic=이/가-아니에요",
    },
    {
      title: "(장소)에 있어요/없어요",
      description: "Expressing existence with 있어요/없어요.",
      path: "/quiz/solve?type=grammar&topic=에-있어요/없어요",
    },
    {
      title: "을/를, 아요/어요(present tense)",
      description: "Object markers 을/를 and Present tense endings 아요/어요.",
      path: "/quiz/solve?type=grammar&topic=을/를-아요/어요",
    },
    {
      title: "(Place)에서",
      description: "Particle 에서 for location of action.",
      path: "/quiz/solve?type=grammar&topic=(Place)에서",
    },
    {
      title: "았어요/었어요(past tense)",
      description: "Past tense endings 았어요/었어요.",
      path: "/quiz/solve?type=grammar&topic=았어요/었어요",
    },
    {
      title: "(Time)에",
      description: "Specifying time with 에.",
      path: "/quiz/solve?type=grammar&topic=(Time)에",
    },
    {
      title: "부터/까지",
      description: "Starting and ending points with 부터/까지.",
      path: "/quiz/solve?type=grammar&topic=부터/까지",
    },
    {
      title: "안",
      description: "Negating verbs and adjectives with 안.",
      path: "/quiz/solve?type=grammar&topic=안",
    },
    {
      title: "위/아래/앞/뒤 etc.",
      description: "Describing locations with 위치-related particles.",
      path: "/quiz/solve?type=grammar&topic=위/아래/앞/뒤",
    },
    {
      title: "으러 가요/와요",
      description: "Expressing purpose with 으러 가요/와요.",
      path: "/quiz/solve?type=grammar&topic=으러-가요/와요",
    },
    {
      title: "으세요/지 마세요",
      description: "Requests with 으세요 and prohibitions with 지 마세요.",
      path: "/quiz/solve?type=grammar&topic=으세요/지-마세요",
    },
    {
      title: "으로",
      description: "Indicating direction or means with 으로.",
      path: "/quiz/solve?type=grammar&topic=으로",
    },
    {
      title: "고 싶어요/싶어해요",
      description: "Expressing desires with 고 싶어요/싶어해요.",
      path: "/quiz/solve?type=grammar&topic=고-싶어요/싶어해요",
    },
    {
      title: "을 거예요",
      description: "Future intentions with 을 거예요.",
      path: "/quiz/solve?type=grammar&topic=을-거예요",
    },
    {
      title: "을 수 있어요/없어요",
      description: "Ability or inability with 수 있어요/없어요.",
      path: "/quiz/solve?type=grammar&topic=을-수-있어요/없어요",
    },
    {
      title: "아야/어야 해요",
      description: "Expressing necessity with 아야/어야 해요.",
      path: "/quiz/solve?type=grammar&topic=아야/어야-해요",
    },
    {
      title: "못",
      description: "Negating verbs using 못.",
      path: "/quiz/solve?type=grammar&topic=못",
    },
    {
      title: "못하다 잘하다 잘 못하다",
      description: "Differentiating 못하다, 잘하다, and 잘 못하다.",
      path: "/quiz/solve?type=grammar&topic=못하다-잘하다-잘-못하다",
    },
    {
      title: "에서/까지",
      description:
        "Using 에서 for actions at a location and 까지 up to a point.",
      path: "/quiz/solve?type=grammar&topic=에서/까지",
    },
  ];

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Select Grammar Topic
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {grammarTopics.map((topic, idx) => (
          <Link
            key={idx}
            href={{
              pathname: "/quiz/settings",
              query: { topic: topic.title },
            }}
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
            <p className="text-gray-600">{topic.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GrammarTopicSelection;
