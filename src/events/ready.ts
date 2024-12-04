import { 
    Client, 
    TextChannel, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} from 'discord.js';
import { createSelectMenu } from '../components/selectMenu'; // Fonction pour créer le menu de sélection des catégories
import { CHANNEL_ID } from '../config/config'; // Constante contenant l'ID du salon où envoyer le message du menu

/**
 * Fonction appelée lorsque le bot Discord est prêt et connecté.
 * 
 * @param {Client} client - Le client Discord.
 */
export async function handleReady(client: Client) {
    // Affiche dans la console que le bot est connecté, avec son tag utilisateur
    console.log(`Connecté en tant que ${client.user?.tag}`);
    
    // Envoie le message avec le menu de sélection dans le salon spécifié
    await sendSelectMenuMessage(client);
}

/**
 * Envoie un message contenant un embed et un menu de sélection dans un salon spécifique.
 * 
 * Ce message permet aux utilisateurs de sélectionner une catégorie pour ouvrir un ticket.
 * 
 * @param {Client} client - Le client Discord.
 */
async function sendSelectMenuMessage(client: Client) {
    try {
        // Récupère le salon Discord en utilisant l'ID spécifié dans la configuration
        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        if (!channel) {
            // Log une erreur si le salon n'est pas trouvé
            console.error('Salon non trouvé.');
            return;
        }

        // Crée le menu de sélection en utilisant la fonction personnalisée
        const selectMenu = createSelectMenu();

        // Crée une ligne d'action et y ajoute le menu de sélection
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Création de l'embed pour le message
        const embed = new EmbedBuilder()
            .setDescription(`
                    # Bienvenue ! :wave::skin-tone-2:
                    ### :warning: Lors de l'ouverture d'un ticket, n'oubliez jamais les formes et la politesse. Les tickets ouverts sans seront automatiquement __fermés__.

                    :microphone2: **Partenariat**
                    Je suis créateur(trice) de contenu/membre d'une organisation, je souhaites nouer un partenariat.

                    :question: **Question / Aide**
                    Je souhaite poser une question. J'ai envie d'organiser un événement et j'ai besoin d'aide pour l'organiser.

                    :rage: **Plainte**
                    J'ai un problème avec un membre de BadLands et je souhaites le signaler.

                    :moneybag: **Remboursement**
                    Vous souhaitez être remboursé(e) d'items virtuels (si le problème est à cause d'un bug)

                    :bug: **Signalement de bug**
                    J'ai rencontré(e) un problème / un comportement anormal du serveur de jeu et souhaite le signaler.

                    :speaking_head: **Contestation de sanction**
                    J'ai été sanctionné(e) et conteste ma sanction.

                    :zap: **Intervention**
                    Tickets nécessitant l'intervention d'un opérateur (Unclaim d'un land, placer une affiche dans le Spawn..)
                `) // Description détaillée de l'embed avec les différentes catégories de tickets
            .setColor("#fc7703"); // Définit la couleur de l'embed (hexadécimal)

        // Envoie le message dans le salon avec l'embed et le menu de sélection
        await channel.send({ 
            embeds: [embed], 
            components: [row] 
        });
        
        // Log dans la console que le message a été envoyé avec succès
        console.log('Message avec le menu de sélection envoyé avec succès.');
    } catch (error) {
        // Gère et log les erreurs potentielles lors de l'envoi du message
        console.error('Erreur lors de l\'envoi du message :', error);
    }
}
