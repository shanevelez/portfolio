
import React, { useState } from "react";

const RECIPES = {
  custom: {
    name: "Original Custom Poolish",
    description: "Your existing poolish recipe",
    poolishFlourPct: 0.193,
    saltPct: 0.0257,
    yeastPct: 0.002,
    honeyPct: 0.002,
    oilPct: 0,
    defaultHydration: 64.5,
  },
  vito: {
    name: "Vito Iacopelli",
    description: "Double Fermentation Pizza Dough",
    poolishFlourPct: 0.30,
    saltPct: 0.03,
    yeastPct: 0.005,
    honeyPct: 0.005,
    oilPct: 0.01,
    defaultHydration: 70,
  },
};

const PizzaCalculator = () => {
  const [recipeKey, setRecipeKey] = useState("custom");
  const [ballWeight, setBallWeight] = useState(280);
  const [ballCount, setBallCount] = useState(6);
  const [hydration, setHydration] = useState(64.5);

  const recipe = RECIPES[recipeKey];

  const selectRecipe = (key) => {
    setRecipeKey(key);
    setHydration(RECIPES[key].defaultHydration);
  };

  const currentHydrationPct = hydration / 100;

  // Poolish is always 100% hydration.
  const poolishWaterPct = recipe.poolishFlourPct;
  const mainFlourPct = 1 - recipe.poolishFlourPct;
  const mainWaterPct =
    currentHydrationPct - poolishWaterPct;

  // Include all ingredients in total dough weight.
  const totalPercentageSum =
    1 +
    currentHydrationPct +
    recipe.saltPct +
    recipe.yeastPct +
    recipe.honeyPct +
    recipe.oilPct;

  // Keep the original 2% bowl-loss allowance.
  const targetDoughWeight =
    ballWeight * ballCount * 1.02;

  const totalFlour =
    targetDoughWeight / totalPercentageSum;

  const poolishFlour =
    totalFlour * recipe.poolishFlourPct;

  const poolishWater =
    totalFlour * poolishWaterPct;

  const mainFlour =
    totalFlour * mainFlourPct;

  const mainWater =
    totalFlour * mainWaterPct;

  const salt =
    totalFlour * recipe.saltPct;

  const yeast =
    totalFlour * recipe.yeastPct;

  const honey =
    totalFlour * recipe.honeyPct;

  const oil =
    totalFlour * recipe.oilPct;

  const formatGrams = (value) =>
    `${Math.round(value)}g`;

  const formatSmallGrams = (value) =>
    `${value.toFixed(1)}g`;

  const IngredientRow = ({ label, value, precise }) => (
    <li className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-mono text-white whitespace-nowrap">
        {precise
          ? formatSmallGrams(value)
          : formatGrams(value)}
      </span>
    </li>
  );

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white font-sans flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">

        <h2 className="text-3xl font-bold text-sky-300 mb-2 text-center">
          Poolish Pizza Calculator
        </h2>

        <p className="text-slate-400 text-sm text-center mb-6">
          Customizable Hydration | 2% Bowl Loss Buffer
        </p>

        {/* Recipe selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Recipe
          </label>

          <select
            value={recipeKey}
            onChange={(e) => selectRecipe(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-sky-400"
          >
            <option value="custom">
              Original Custom Poolish
            </option>
            <option value="vito">
              Vito Iacopelli - Double Fermentation
            </option>
          </select>

          <p className="text-xs text-slate-400 mt-2">
            {recipe.description}
          </p>
        </div>

        {/* Ball weight and count */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ball Weight (g)
            </label>

            <input
              type="number"
              min="1"
              value={ballWeight}
              onChange={(e) =>
                setBallWeight(
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Number of Balls
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={ballCount}
              onChange={(e) =>
                setBallCount(
                  Math.max(
                    0,
                    Math.floor(Number(e.target.value))
                  )
                )
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Hydration slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Hydration
            </label>

            <span className="font-mono text-sky-400 font-bold text-sm">
              {hydration}%
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="90"
            step="0.5"
            value={hydration}
            onChange={(e) =>
              setHydration(Number(e.target.value))
            }
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700"
          />
        </div>

        <hr className="border-slate-700 mb-6" />

        {/* Ingredients */}
        <div className="space-y-6">

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-sky-400">
                Day 1: The Poolish
              </h3>

              <span className="text-xs text-slate-400">
                {(recipe.poolishFlourPct * 100).toFixed(1)}%
                {" "}flour
              </span>
            </div>

            <ul className="bg-slate-900 border border-slate-700/50 rounded-lg p-3 space-y-2 text-slate-300">
              <IngredientRow
                label="Tipo 00 Flour:"
                value={poolishFlour}
              />

              <IngredientRow
                label="Water:"
                value={poolishWater}
              />

              <IngredientRow
                label="Yeast:"
                value={yeast}
                precise
              />

              <IngredientRow
                label="Honey:"
                value={honey}
                precise
              />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-sky-400 mb-2">
              Day 2: Main Dough
            </h3>

            <ul className="bg-slate-900 border border-slate-700/50 rounded-lg p-3 space-y-2 text-slate-300">
              <IngredientRow
                label="Flour Remainder:"
                value={mainFlour}
              />

              <IngredientRow
                label="Water Remainder:"
                value={mainWater}
              />

              <IngredientRow
                label="Fine Sea Salt:"
                value={salt}
              />

              {recipe.oilPct > 0 && (
                <IngredientRow
                  label="Olive Oil:"
                  value={oil}
                />
              )}
            </ul>
          </div>

        </div>

        {/* Fermentation instructions */}
        {recipeKey === "vito" && (
          <div className="mt-6 bg-slate-900 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sky-400 font-bold mb-3">
              Fermentation Schedule
            </h3>

            <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-slate-300">
              <li>
                Mix the poolish ingredients. Leave covered
                for 1 hour at room temperature.
              </li>

              <li>
                Refrigerate the poolish for 16-24 hours.
              </li>

              <li>
                Mix the poolish with the remaining flour,
                water, salt and olive oil.
              </li>

              <li>
                Cover the main dough and refrigerate
                for another 16-24 hours.
              </li>

              <li>
                Remove from the fridge and rest
                for 1-2 hours.
              </li>

              <li>
                Divide and ball the dough. Rest for
                another 2-4 hours at room temperature.
              </li>

              <li>
                Stretch, top and bake in a fully
                preheated pizza oven.
              </li>
            </ol>
          </div>
        )}

        {recipeKey === "custom" && (
          <p className="mt-6 text-xs text-slate-400 text-center">
            Original ingredient proportions preserved.
            Follow your existing fermentation schedule.
          </p>
        )}

        {/* Yield */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              Total Flour
            </span>
            <span className="font-mono text-white">
              {formatGrams(totalFlour)}
            </span>
          </div>

          <div className="flex justify-between text-sm mt-2">
            <span className="text-slate-400">
              Target Dough Yield
            </span>
            <span className="font-mono text-white">
              {formatGrams(targetDoughWeight)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 text-center italic">
          {ballCount} × {ballWeight}g balls
          {" "}with a 2% bowl loss buffer
        </p>

      </div>

      <a
        href="/"
        className="mt-6 text-sm text-slate-400 hover:text-sky-300 transition"
      >
        ← Back to Portfolio
      </a>
    </div>
  );
};

export default PizzaCalculator;
