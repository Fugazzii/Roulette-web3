import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

import { useRecoilValue } from 'recoil';
import { ANIMATION } from './context';

export default function Scene() {
    const _ANIMATION = useRecoilValue(ANIMATION); 
    function Board() {
        const boardRef: React.MutableRefObject<any> = useRef();
        useFrame(state => {
            if(!boardRef.current) {
                return;
            }
            
        })

        const board = useGLTF('/roulette/scene.gltf');
        const animations = useAnimations(board.animations, board.scene);
        useEffect(() => {
            if(_ANIMATION) {
                const action = animations.actions.Animation;
                action?.play();    
            }
            console.log("Animation:" + _ANIMATION);
        }, [_ANIMATION]);

        return <primitive 
            ref={boardRef} 
            rotation={[ Math.PI / 8, 0, Math.PI / 32 ]} 
            position={[0, 1, 0]} 
            object={board.scene} 
            scale={1}
            />
    }

    return (
        <Canvas style={{ zIndex: "-1", height: '100vh', width: "50%" }}>
            <PerspectiveCamera />
            <OrbitControls enableZoom={false}/>
            <ambientLight args={['#a6a6a6', 1]} />
            <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
            <Board />
        </Canvas>
    );
}