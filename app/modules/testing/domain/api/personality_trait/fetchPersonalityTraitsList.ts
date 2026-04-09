export const loadPersonalityTraitsList = () => {
    const api = useApi();

    return useAsyncData('personality_traits', async () => {
        const data = await api.v1.testingPublicServiceGetPersonalityTraits();
        if (data.error !== null) {
            throw data.error;
        }
        return data.data;
    });
};
