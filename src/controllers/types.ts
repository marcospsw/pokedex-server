import axios from "axios";
import { Router } from "express";
import { SpecificType, Type } from "../models/type";

const typesRouter = Router();

typesRouter.get(
  '/', async (req, res) => {
    async function getTypes(){
      const { data } = await axios.get('https://pokeapi.co/api/v2/type/');
      const types = data.results;
      return types;
    }
  
    async function getType(url: string) {
      const { data } = await axios.get(url);
      const type = data;

      return {
        url,
        name: type.name,
        id: type.id,    
      };
    }
  
    try {
      let types = await getTypes();
      const completeTypes = await Promise.all(types.map(async (type: Type): Promise<Object> => {
        const completeType = await getType(type.url);
        return completeType.id <= 18 ? completeType : null;
      }));
      
      return res.json(completeTypes.filter(Boolean));
    } catch (error) {
      console.log(error);
    }
});

typesRouter.get(
  '/specific', async (req, res) => {
    const { id } = req.query;
    const typeId = parseInt(id.toString());


    async function getTypeDamages(id: number) {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/type/${id}`);
      const type = data;

      return {
        name: type.name,
        weaknesses: type.damage_relations.double_damage_from,
        advantages: type.damage_relations.double_damage_to,
      };
    }
  
    try {
      const completeType: SpecificType = await getTypeDamages(typeId);

      return res.json(completeType);
    } catch (error) {
      console.log(error);
    }
});



export default typesRouter;