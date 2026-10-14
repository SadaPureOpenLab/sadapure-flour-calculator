// Food experiments selected for ingredient exploration, not therapeutic recipes.
// Exact ratios below are product-development choices; references do not validate them.
export const GOAL_EXAMPLES:Record<string,Record<string,number>>={
 everyday:{wheat:50,'oat-flour':15,barley:10,'brown-rice':10,besan:10,flax:5},
 family:{wheat:65,'oat-flour':10,barley:10,besan:10,flax:5},
 wholegrain:{wheat:55,barley:15,'oat-flour':15,'brown-rice':10,'oat-bran':5},
 fibre:{wheat:45,'oat-flour':20,barley:15,'oat-bran':10,besan:7,flax:3},
 protein:{wheat:45,besan:20,'mung-bean':10,'red-lentil':10,'oat-flour':10,pumpkin:5},
 weight:{wheat:55,'oat-flour':15,barley:15,besan:10,'oat-bran':5},
 digestion:{wheat:70,'white-rice':20,'oat-flour':10},
 constipation:{wheat:50,'oat-flour':20,'oat-bran':10,barley:15,flax:5},
 heart:{wheat:50,'oat-flour':25,barley:15,besan:5,flax:5},
 bp:{wheat:55,'oat-flour':20,'brown-rice':10,besan:10,flax:5},
 iron:{wheat:50,besan:15,'finger-millet':10,amaranth:10,pumpkin:5,'oat-flour':10},
 sports:{wheat:55,'oat-flour':20,besan:15,'brown-rice':5,pumpkin:5},
 gluten:{'brown-rice':35,sorghum:25,millet:15,buckwheat:10,besan:10,flax:5},
 wheat:{'brown-rice':40,sorghum:20,millet:20,besan:15,flax:5},
 sesame:{wheat:60,'oat-flour':15,barley:10,besan:10,pumpkin:5},
 nuts:{wheat:60,'oat-flour':20,'brown-rice':10,besan:10},
 lowcarb:{wheat:40,besan:25,soy:10,'oat-flour':15,pumpkin:5,flax:5}
};
