import { MatchingCallbackCustom } from "../../../types/private/MatchingCallbackCustom";
import {
  CustomCallback,
  FireArgs,
  OptionalArgs,
} from "../../private/CustomCallback";

type CallbackSignatureSpikes = (spikes: GridEntitySpikes) => void;
type ModCallbackCustomSpikes = MatchingCallbackCustom<CallbackSignatureSpikes>;

export class CustomCallbackSpikes<
  T extends ModCallbackCustomSpikes,
> extends CustomCallback<T> {
  // eslint-disable-next-line class-methods-use-this
  protected override shouldFire(
    fireArgs: FireArgs<T>,
    optionalArgs: OptionalArgs<T>,
  ): boolean {
    const [callbackVariant] = optionalArgs;
    if (callbackVariant === undefined) {
      return true;
    }

    const [spikes] = fireArgs;
    const variant = spikes.GetVariant();
    return variant === callbackVariant;
  }
}
