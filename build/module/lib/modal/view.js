import { appleLogo, bitbucketLogo, discordLogo, facebookLogo, githubLogo, gitlabLogo, googleLogo, linkedinLogo, MagicLogo, microsoftLogo, twitchLogo, twitterLogo, } from './logos';
import { modalStyles } from './styles';
export const createModal = async (props) => {
    // INJECT FORM STYLES
    const style = document.createElement('style');
    style.innerHTML = modalStyles(props.accentColor);
    document.head.appendChild(style);
    // PROVIDERS FOR OAUTH BUTTONS
    const allProviders = [
        { name: 'google', icon: googleLogo },
        { name: 'facebook', icon: facebookLogo },
        { name: 'apple', icon: appleLogo },
        { name: 'github', icon: githubLogo },
        { name: 'bitbucket', icon: bitbucketLogo },
        { name: 'gitlab', icon: gitlabLogo },
        { name: 'linkedin', icon: linkedinLogo },
        { name: 'twitter', icon: twitterLogo },
        { name: 'discord', icon: discordLogo },
        { name: 'twitch', icon: twitchLogo },
        { name: 'microsoft', icon: microsoftLogo },
    ];
    // make providers included in oauthProviders
    const providers = props.oauthProviders
        ?.map((provider) => {
        return allProviders.find((p) => p.name === provider);
    })
        .filter((p) => p !== undefined);
    const phoneNumberRegex = `(\\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$`;
    const emailRegex = `^([a-zA-Z0-9_.-])+(\\+[a-zA-Z0-9-]+)?@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})`;
    // MODAL HTML
    const modal = `
    <div class="Magic__formContainer ${props.isDarkMode ? `Magic__dark` : ``}" id="MagicModalBody">
      <button class="Magic__closeButton" id="MagicCloseBtn">&times;</button>
      <div class="Magic__formHeader">
        ${props.customLogo
        ? `<img class="Magic__customLogo" src="${props.customLogo}" />`
        : `<div class="Magic__logo">${MagicLogo}</div>`}
        <h1 class='Magic__logoText'> ${props.customHeaderText || 'Magic'} </h1>

        <form class="Magic__formBody" id="MagicForm">
          ${props.enableSMSLogin && props.enableEmailLogin
        ? `
               <label class="Magic__FormLabel">Sign-in with Phone or Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required pattern = "${emailRegex}|${phoneNumberRegex}" placeholder="Phone or Email" />
               `
        : props.enableEmailLogin
            ? `
               <label class="Magic__FormLabel">Sign-in with Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required type="email" placeholder="address@example.com" />
               `
            : props.enableSMSLogin
                ? `
                <label class="Magic__FormLabel">Sign-in with Phone</label>
                <input class="Magic__formInput" id="MagicFormInput" required type="tel" pattern="${phoneNumberRegex}" placeholder="+11234567890" />
              `
                : ``}
          ${props.enableSMSLogin || props.enableEmailLogin
        ? ` <button class="Magic__submitButton" type="submit">
                Send login link
              </button>`
        : ``}
        </form>
        ${providers &&
        providers.length > 0 &&
        (props.enableSMSLogin || props.enableEmailLogin)
        ? `<div class="Magic__divider">
        &#9135;&#9135;&#9135; OR &#9135;&#9135;&#9135;
        </div>`
        : ``}
        <div class="${!props.enableEmailLogin && !props.enableSMSLogin
        ? `Magic__oauthButtonsContainer Magic__aloneOauthContainer`
        : `Magic__oauthButtonsContainer`}">
          ${providers
        ?.map((provider) => {
        return `
                <button class="Magic__oauthButton" id="MagicOauth${provider?.name}" data-provider="${provider?.name}" >
                  <span class="Magic__oauthButtonIcon">${provider?.icon}</span>
                  ${!props.enableSMSLogin && !props.enableEmailLogin
            ? `<span class="Magic__oauthButtonName">${provider?.name}</span>`
            : ``}
                </button>
              `;
    })
        .join('')}
        </div>
        ${!props.enableEmailLogin &&
        !props.enableEmailLogin &&
        providers?.length === 0
        ? `<div>No Login Methods Configured 😥</div>`
        : ``}
      </div>
    </div>
  `;
    // ADD FORM TO BODY
    const overlay = document.createElement('div');
    overlay.classList.add('Magic__formOverlay');
    if (props.isDarkMode)
        overlay.classList.add('Magic__dark');
    document.body.appendChild(overlay);
    overlay.innerHTML = modal;
    const formBody = document.getElementById('MagicModalBody');
    setTimeout(() => {
        if (formBody)
            formBody.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    // FORM SUBMIT HANDLER
    const removeForm = () => {
        if (formBody)
            formBody.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            overlay.remove();
        }, 200);
    };
    return new Promise((resolve) => {
        // FORM CLOSE BUTTON
        document.getElementById('MagicCloseBtn')?.addEventListener('click', () => {
            removeForm();
            resolve({
                email: '',
                phoneNumber: '',
                isGoogle: false,
                isDiscord: false,
            });
        });
        // EMAIL FORM SUBMIT HANDLER
        document.getElementById('MagicForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formInputField = document.getElementById('MagicFormInput');
            const isFormValid = formInputField?.checkValidity();
            if (isFormValid) {
                let output;
                if (RegExp(phoneNumberRegex).test(formInputField.value)) {
                    output = {
                        phoneNumber: formInputField?.value,
                    };
                }
                else {
                    output = {
                        email: formInputField?.value,
                    };
                }
                removeForm();
                resolve(output);
            }
        });
        // OAUTH BUTTONS
        providers?.forEach((provider) => {
            const oauthButton = document.getElementById(`MagicOauth${provider?.name}`);
            oauthButton?.addEventListener('click', () => {
                const output = {
                    oauthProvider: provider?.name,
                };
                removeForm();
                resolve(output);
            });
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9kYWwvdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGFBQWEsRUFDYixXQUFXLEVBQ1gsWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLFVBQVUsRUFDVixXQUFXLEdBQ1osTUFBTSxTQUFTLENBQUM7QUFDakIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV2QyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxFQUFFLEtBUWpDLEVBQUUsRUFBRTtJQUNILHFCQUFxQjtJQUNyQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqQyw4QkFBOEI7SUFDOUIsTUFBTSxZQUFZLEdBQUc7UUFDbkIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7UUFDcEMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUU7UUFDeEMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDbEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7UUFDcEMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7UUFDMUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7UUFDcEMsRUFBRSxJQUFJ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